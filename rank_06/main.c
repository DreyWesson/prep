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

int client_no = 0, max_fd = 0;
fd_set readfds, writefds, activefds;
char buf_read[4097], buf_write[257];
t_client *clients = NULL;

void ft_free(t_client *client) {
    free(client->msg);
    close(client->fd);
    free(client);
}

void cleanup() {
    t_client *current = clients;
    while (current)
    {
        t_client *next = current->next;
        ft_free(current);
        current = next;
    }
    clients = NULL;
}

void fatal_error() {
    cleanup();
    write(2, "Fatal error\n", 12);
    exit(1);
}

t_client *addClient(int fd) {
    t_client *new_client = malloc(sizeof(t_client));
    if (!new_client) fatal_error();

    new_client->id = client_no++;
    new_client->fd = fd;
    new_client->msg = NULL;
    new_client->next = clients;
    clients = new_client;

    return new_client;
}

t_client *findClient(int fd) {
    t_client * tmp = clients;

    while (tmp && tmp->fd != fd)
        tmp = tmp->next;
    return (tmp);
}

void removeClient(int fd) {
    t_client * tmp = clients;
    t_client * prev = NULL;

    while (tmp && tmp->fd != fd) {
        prev = tmp;
        tmp = tmp->next;
    }
    if (tmp) {
        if (prev)
            prev->next = tmp->next;
        else
            clients = tmp->next;
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

void notify_other(int author, char *str) {
    t_client *client = clients;
    while (client) {
        if (FD_ISSET(client->fd, &writefds) && client->fd != author) {
            if (send(client->fd, str, strlen(str), 0) < 0) fatal_error();
        }
        client = client->next;
    }
}

void notify_client_event(int fd, const char *pre_str, const char *post_str, int client_id) {
    snprintf(buf_write, sizeof(buf_write), "%s%d%s", pre_str, client_id, post_str);
    notify_other(fd, buf_write);
}


void register_client(int fd) {
    t_client *new_client = addClient(fd);

    max_fd = fd > max_fd ? fd : max_fd;
    FD_SET(fd, &activefds);
    notify_client_event(fd, "server: client ", " just arrived\n", new_client->id);
}

void deregisterClient(int fd) {
    t_client *cur = findClient(fd);
    if (cur) {
        notify_client_event(fd, "server: client ", " just left\n", cur->id);;
        FD_CLR(fd, &activefds);
        removeClient(fd);
    }
}

void send_msg(int fd) {
    t_client *client = findClient(fd);
    if (client) {
        char *msg;
        while (extract_message(&(client->msg), &msg)) {
            notify_client_event(fd, "client ", ": ", client->id);
            notify_other(fd, msg);
            free(msg);
        }
    }
}

int create_socket() {
    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    if (sockfd < 0) fatal_error();
    FD_SET(sockfd, &activefds);
    max_fd = sockfd;
    return sockfd;
}

void setup_server_address(struct sockaddr_in *servaddr, int port) {
    bzero(servaddr, sizeof(*servaddr));
    servaddr->sin_family = AF_INET;
    servaddr->sin_addr.s_addr = htonl(2130706433); // 127.0.0.1
    servaddr->sin_port = htons(port);
}

void bind_and_listen(int sockfd, struct sockaddr_in *servaddr) {
    if (bind(sockfd, (const struct sockaddr *)servaddr, sizeof(*servaddr))) fatal_error();
    if (listen(sockfd, SOMAXCONN)) fatal_error();
}

void handle_new_client(int sockfd, struct sockaddr_in *servaddr) {
    socklen_t addr_len = sizeof(*servaddr);
    int client_fd = accept(sockfd, (struct sockaddr *)servaddr, &addr_len);
    if (client_fd >= 0) register_client(client_fd);
}

void handle_client_message(int fd) {
    int read_bytes = recv(fd, buf_read, 1000, 0);
    if (read_bytes <= 0) deregisterClient(fd);
    else {
        buf_read[read_bytes] = '\0';
        t_client *client = findClient(fd);
        if (client) {
            char *new_msg = str_join(client->msg, buf_read);
            free(client->msg);
            client->msg = new_msg;
            send_msg(fd);
        }
    }
}

void handle_fds(int sockfd, struct sockaddr_in *servaddr) {
    for (int fd = 0; fd <= max_fd; fd++) {
        if (FD_ISSET(fd, &readfds))
            (fd == sockfd) ? handle_new_client(sockfd, servaddr) : handle_client_message(fd);
    }
}

void runServer(int sockfd, struct sockaddr_in *servaddr) {
    readfds = activefds;
    writefds = activefds;
    if (select(max_fd + 1, &readfds, &writefds, NULL, NULL) < 0) fatal_error();
    handle_fds(sockfd, &servaddr);
}

int main(int ac, char **av) {
    if (ac != 2) {
        write(2, "Wrong number of arguments\n", 26);
        exit(1);
    }

    FD_ZERO(&activefds);
    int sockfd = create_socket();
    struct sockaddr_in servaddr;
    setup_server_address(&servaddr, atoi(av[1]));
    bind_and_listen(sockfd, &servaddr);
    while (1)
        runServer(sockfd, &servaddr);
    return 0;
}