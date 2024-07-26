#include <errno.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <stdio.h>
#include <sys/socket.h>
#include <netinet/in.h>

// create structs
typedef struct s_client {
    int fd;
    int id;
    char *msg;
    struct t_client *next;
} t_client;

typedef struct s_server {
    int port;
    int sockfd;
    int max_fd;
    int counter;
    t_client *head;
    struct sockaddr_in servaddr;
    fd_set readfds, writefds, activefds;
} t_server;
// linked list crud
t_server *initServer (int port) {
    t_server *server = (t_server *)malloc(sizeof(t_server));
    // if (!server) fatalError(NULL);
    bzero(server, sizeof(t_server));
    FD_ZERO(&server->activefds);
    server->port = port;
    return (server);
}
t_client *addClients(t_server * server, int fd) {
    t_client *new_client = (t_client *)malloc(sizeof(t_client));
    // if (!new_client) fatalError();
    new_client->id = server->counter++;
    new_client->fd = fd;
    new_client->msg = NULL;
    new_client->next = server->head;
    server->head = new_client;

    return (new_client);
}
// fatal error and ft_free
// sendNotification
// add main function
// init server
// create socket
// configure address
// bind and listen
// handle connections 
    // handle fds
    // call acceptRegistration or processMessage

int main(int argc, char **argv) {
    (void)argv;
    if (argc != 2) {
        fprintf(stderr, "Wrong number of arguments\n");
        exit(1);
    }
    t_server *server = initServer(atoi(argv[2]));
    (void)server;
    return (0);
}
