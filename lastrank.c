#include <netinet/ip.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

typedef struct s_client {
    int                 id;
    int                 fd;
    char                *msg;
    struct s_client     *next;
}                       t_client;

typedef struct s_server {
    t_client            *head;
    int                 port;
    int                 max_fd;
    int                 sockfd;
    int                 counter;
    struct sockaddr_in  addr;
    fd_set              readfds, writefds, activefds;
}                       t_server;

void    ftFree(t_client *client) {
    if (client) {
        if (client->msg) free(client->msg);
        close(client->fd);
        free(client);
    }
}

void    deleteClients(t_server *server) {
    t_client    *current;
    t_client    *next;

    if (server) {
        current = server->head;
        while (current) {
            next = current->next;
            ftFree(current);
            current = next;
        }
        server->head = NULL;
        free(server);
    }
}

void    fatalError(t_server *server) {
    deleteClients(server);
    write(2, "Fatal error\n", 12);
    exit(1);
}

t_client    *addClient(t_server *server, int fd) {
    t_client    *new_client;

    new_client = malloc(sizeof(t_client));
    if (!new_client) fatalError(server);
    new_client->id = server->counter++;
    new_client->fd = fd;
    new_client->msg = NULL;
    new_client->next = server->head;
    server->head = new_client;
    return (new_client);
}

t_client    *findClient(t_server *server, int fd) {
    t_client    *tmp;

    tmp = server->head;
    while (tmp && tmp->fd != fd)
        tmp = tmp->next;
    return (tmp);
}

void    removeClient(t_server *server, int fd) {
    t_client    *tmp;
    t_client    *prev;

    tmp = server->head;
    prev = NULL;
    while (tmp && tmp->fd != fd) {
        prev = tmp;
        tmp = tmp->next;
    }
    if (tmp) {
        if (prev)
            prev->next = tmp->next;
        else
            server->head = tmp->next;
        ftFree(tmp);
    }
}

int extractMessage(char **buf, char **msg)
{
    char    *newbuf;
    int i;

    *msg = 0;
    if (*buf == 0 || **buf == '\0')
        return (0);
    i = 0;
    while ((*buf)[i])
    {
        if ((*buf)[i] == '\n')
        {
            newbuf = calloc(1, sizeof(*newbuf) * (strlen(*buf + i + 1) + 1));
            if (newbuf == 0)
                return (-1);
            strcpy(newbuf, *buf + i + 1);
            *msg = *buf;
            (*msg)[i + 1] = 0;
            *buf = newbuf;
            return (1);
        }
        i++;
    }
    return (0);
}

char *str_join(char *buf, char *add)
{
    char    *newbuf;
    int     len;

    if (buf == 0)
        len = 0;
    else
        len = strlen(buf);
    newbuf = malloc(sizeof(*newbuf) * (len + strlen(add) + 1));
    if (newbuf == 0)
        return (0);
    newbuf[0] = 0;
    if (buf != 0)
        strcat(newbuf, buf);
    free(buf);
    strcat(newbuf, add);
    return (newbuf);
}

void    sendNotification(t_server *server, int author_fd, char *str) {
    t_client    *client;

    client = server->head;
    while (client) {
        if (FD_ISSET(client->fd, &server->writefds) && client->fd != author_fd) {
            if (send(client->fd, str, strlen(str), 0) < 0) fatalError(server);
        }
        client = client->next;
    }
}

void    sendMessage(t_server *server, int fd, t_client *client) {
    char        *msg;
    char        buf_write[256];

    while (extractMessage(&(client->msg), &msg)) {
        sprintf(buf_write, "client %d: ", client->id);
        sendNotification(server, fd, buf_write);
        sendNotification(server, fd, msg);
        free(msg);
    }
}

void    deregisterClient(t_server *server, int fd) {
    t_client    *cur;
    char        buf_write[256];

    cur = findClient(server, fd);
    if (cur) {
        sprintf(buf_write, "server: client %d just left\n", cur->id);
        sendNotification(server, fd, buf_write);
        FD_CLR(fd, &server->activefds);
        removeClient(server, fd);
    }
}

void    processMessage(t_server *server, int fd) {
    char        buf_read[4096];
    int         read_bytes;
    t_client    *client;

    read_bytes = recv(fd, buf_read, sizeof(buf_read) - 1, 0);
    if (read_bytes <= 0)
        deregisterClient(server, fd);
    else {
        buf_read[read_bytes] = '\0';
        client = findClient(server, fd);
        if (client) {
            client->msg = str_join(client->msg, buf_read);
            sendMessage(server, fd, client);
        }
    }
}

void    registerClient(t_server *server, int fd) {
    t_client    *new_client;
    char        buf_write[256];

    new_client = addClient(server, fd);
    server->max_fd = fd > server->max_fd ? fd : server->max_fd;
    FD_SET(fd, &server->activefds);
    sprintf(buf_write, "server: client %d just arrived\n", new_client->id);
    sendNotification(server, fd, buf_write);
}

void    acceptRegistration(t_server *server) {
    int         connfd;
    socklen_t   addr_len;

    addr_len = sizeof(&server->addr);
    connfd = accept(server->sockfd, (struct sockaddr *)&server->addr, &addr_len);
    if (connfd < 0) fatalError(server);
    registerClient(server, connfd);
}

void    handleFDs(t_server *server) {
    for (int fd = 0; fd <= server->max_fd; fd++) {
        if (FD_ISSET(fd, &server->readfds)) {
            (fd == server->sockfd) ? acceptRegistration(server) : processMessage(server, fd);
        }
    }
}

void    handleConnections(t_server *server) {
    while (1) {
        server->readfds = server->activefds;
        server->writefds = server->activefds;
        if (select(server->max_fd + 1, &server->readfds, &server->writefds, NULL, NULL) < 0)
            fatalError(server);
        handleFDs(server);
    }
}

void    bindAndListen(t_server *server) {
    if (bind(server->sockfd, (const struct sockaddr *)&server->addr, sizeof(server->addr)))
        fatalError(server);
    if (listen(server->sockfd, SOMAXCONN))
        fatalError(server);
}

void    configureAddress(t_server *server) {
    bzero(&server->addr, sizeof(server->addr));
    server->addr.sin_family = AF_INET;
    server->addr.sin_addr.s_addr = htonl(2130706433);
    server->addr.sin_port = htons(server->port);
}

void    createSocket(t_server *server) {
    server->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (server->sockfd < 0)
        fatalError(server);

    FD_SET(server->sockfd, &server->activefds);
    server->max_fd = server->sockfd;
}

t_server    *initServer(int port) {
    t_server    *server;

    server = (t_server *)malloc(sizeof(t_server) * 1);
    if (!server) fatalError(server);

    bzero(server, sizeof(t_server));
    FD_ZERO(&server->activefds);
    server->port = port;

    return (server);
}

int main(int ac, char **av) {
    t_server    *server;

    if (ac != 2) {
        write(2, "Wrong number of arguments\n", 26);
        exit(1);
    }
    server = initServer(atoi(av[1]));
    createSocket(server);
    configureAddress(server);
    bindAndListen(server);
    handleConnections(server);
    return (0);
}
