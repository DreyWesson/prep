#include <unistd.h>
#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <netinet/ip.h>

typedef struct s_client {
    int id;
    int fd;
    char *msg;
    struct s_client *next;
} t_client;

typedef struct s_server {
    int client_no;
    int max_fd;
    fd_set readfds, writefds, activefds;
    t_client *clients;
} t_server;

void ft_free(t_client *client) {
    if (client) {
        if (client->msg) {
            free(client->msg);
        }
        close(client->fd);
        free(client);
    }
}

void cleanup(t_server *server) {
    if (server) {
        t_client *current = server->clients;
        while (current) {
            t_client *next = current->next;
            ft_free(current);
            current = next;
        }
        server->clients = NULL;
    }
}

void fatal_error(t_server *server) {
    cleanup(server);
    write(2, "Fatal error\n", 12);
    exit(1);
}

t_client *add_client(t_server *server, int fd) {
    t_client *new_client = malloc(sizeof(t_client));
    if (!new_client) fatal_error(server);

    new_client->id = server->client_no++;
    new_client->fd = fd;
    new_client->msg = NULL;
    new_client->next = server->clients;
    server->clients = new_client;

    return new_client;
}

t_client *find_client(t_server *server, int fd) {
    t_client *tmp = server->clients;

    while (tmp && tmp->fd != fd)
        tmp = tmp->next;
    return tmp;
}

void remove_client(t_server *server, int fd) {
    t_client *tmp = server->clients;
    t_client *prev = NULL;

    while (tmp && tmp->fd != fd) {
        prev = tmp;
        tmp = tmp->next;
    }
    if (tmp) {
        if (prev)
            prev->next = tmp->next;
        else
            server->clients = tmp->next;
        ft_free(tmp);
    }
}

int extract_message(char **buf, char **msg) {
    char *newline_pos;
    size_t msg_length;

    *msg = NULL;
    if (*buf == NULL || **buf == '\0')
        return 0;

    newline_pos = strchr(*buf, '\n');
    if (newline_pos != NULL) {
        msg_length = newline_pos - *buf + 1;

        *msg = malloc(msg_length + 1);
        if (*msg == NULL) return -1;

        strncpy(*msg, *buf, msg_length);
        (*msg)[msg_length] = '\0';

        char *newbuf = strdup(newline_pos + 1);
        if (newbuf == NULL) {
            free(*msg);
            return -1;
        }
        free(*buf);
        *buf = newbuf;

        return 1;
    }
    return 0;
}

char *str_join(const char *buf, const char *add) {
    size_t buf_len = buf ? strlen(buf) : 0;
    size_t add_len = add ? strlen(add) : 0;

    char *newbuf = malloc(buf_len + add_len + 1);
    if (!newbuf) return NULL;
    if (buf) strcpy(newbuf, buf);
    if (add) strcpy(newbuf + buf_len, add);
    
    return newbuf;
}

void notify_other(t_server *server, int author, char *str) {
    t_client *client = server->clients;
    while (client) {
        if (FD_ISSET(client->fd, &server->writefds) && client->fd != author) {
            if (send(client->fd, str, strlen(str), 0) < 0) fatal_error(server);
        }
        client = client->next;
    }
}

void notify_client_event(t_server *server, int fd, const char *pre_str, const char *post_str, int client_id) {
    char buf_write[256];
    snprintf(buf_write, sizeof(buf_write), "%s%d%s", pre_str, client_id, post_str);
    notify_other(server, fd, buf_write);
}



void send_msg(t_server *server, int fd) {
    t_client *client = find_client(server, fd);
    if (client) {
        char *msg;
        while (extract_message(&(client->msg), &msg)) {
            notify_client_event(server, fd, "client ", ": ", client->id);
            notify_other(server, fd, msg);
            free(msg);
        }
    }
}

void deregister_client(t_server *server, int fd) {
    t_client *cur = find_client(server, fd);
    if (cur) {
        notify_client_event(server, fd, "server: client ", " just left\n", cur->id);
        FD_CLR(fd, &server->activefds);
        remove_client(server, fd);
    }
}

void handle_client_message(t_server *server, int fd) {
    char buf_read[4096];
    int read_bytes = recv(fd, buf_read, sizeof(buf_read) - 1, 0);
    if (read_bytes <= 0) deregister_client(server, fd);
    else {
        buf_read[read_bytes] = '\0';
        t_client *client = find_client(server, fd);
        if (client) {
            char *new_msg = str_join(client->msg, buf_read);
            free(client->msg);
            client->msg = new_msg;
            send_msg(server, fd);
        }
    }
}

void register_client(t_server *server, int fd) {
    t_client *new_client = add_client(server, fd);
    server->max_fd = fd > server->max_fd ? fd : server->max_fd;
    FD_SET(fd, &server->activefds);
    notify_client_event(server, fd, "server: client ", " just arrived\n", new_client->id);
}

void handle_new_client(t_server *server, int sockfd, struct sockaddr_in *servaddr) {
    socklen_t addr_len = sizeof(*servaddr);
    int client_fd = accept(sockfd, (struct sockaddr *)servaddr, &addr_len);
    if (client_fd >= 0) register_client(server, client_fd);
}

void handle_fds(t_server *server, int sockfd, struct sockaddr_in *servaddr) {
    for (int fd = 0; fd <= server->max_fd; fd++) {
        if (FD_ISSET(fd, &server->readfds)) {
            if (fd == sockfd)
                handle_new_client(server, sockfd, servaddr);
            else
                handle_client_message(server, fd);
        }
    }
}

void handle_connections(t_server *server, int sockfd, struct sockaddr_in *servaddr) {
    while (1) {
        server->readfds = server->activefds;
        server->writefds = server->activefds;
        if (select(server->max_fd + 1, &server->readfds, &server->writefds, NULL, NULL) < 0)
            fatal_error(server);
        handle_fds(server, sockfd, servaddr);
    }
}

t_server initServer() {
    t_server server;
    server.client_no = 0;
    server.max_fd = 0;
    server.clients = NULL;
    FD_ZERO(&server.activefds);
    return server;
}

void configureAddress(struct sockaddr_in *servaddr, int port) {
    bzero(servaddr, sizeof(*servaddr));
    servaddr->sin_family = AF_INET;
    servaddr->sin_addr.s_addr = htonl(2130706433); // 127.0.0.1
    servaddr->sin_port = htons(port);
}

void bind_and_listen(t_server *server, int sockfd, struct sockaddr_in *servaddr) {
    if (bind(sockfd, (const struct sockaddr *)servaddr, sizeof(*servaddr))) fatal_error(server);
    if (listen(sockfd, SOMAXCONN)) fatal_error(server);
}

int create_socket(t_server *server) {
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) fatal_error(server);
    FD_SET(sockfd, &server->activefds);
    server->max_fd = sockfd;
    return sockfd;
}

int main(int ac, char **av) {
    if (ac != 2) {
        write(2, "Wrong number of arguments\n", 26);
        exit(1);
    }

    t_server server = initServer();
    int sockfd = create_socket(&server);
    struct sockaddr_in servaddr;
    configureAddress(&servaddr, atoi(av[1]));
    bind_and_listen(&server, sockfd, &servaddr);
    handle_connections(&server, sockfd, &servaddr);

    return 0;
}
