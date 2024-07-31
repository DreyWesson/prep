#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <netdb.h>
#include <sys/socket.h>
#include <netinet/ip.h>

typedef struct s_client {
    int fd;
    int client_no;
    char *msg;
    struct s_client *next;
} t_client;

typedef struct s_server {
    int sockfd;
    int maxfd;
    int port;
    int counter;
    fd_set readfds, writefds, activefds;
    struct sockaddr_in addr;
    t_client *head;
} t_server;

void fatalError(t_server *server);
void ftFree(t_client *client);
int extract_message(char **buf, char **msg);
char *str_join(char *buf, char *add);
t_client *addClient(t_server *server, int fd);
t_server *initServer (int port);
void deleteAllClients(t_server *server);
void printClients(t_server *server);
t_client *findClient(t_server *server, int fd);
void deleteClient(t_server *server, int fd);
void configureAddress(t_server *server);
void createSocket(t_server *server);
void bindAndListen(t_server *server);
void handleConnections(t_server *server);
void monitorFDs(t_server *server);
void acceptRegistration(t_server *server);
void registerClient(t_server *server, int connfd);
void notifyAllClients(t_server *server, int author_fd, char *msg);
void processMessage(t_server *server, int fd);

int extract_message(char **buf, char **msg)
{
	char	*newbuf;
	int	i;

	*msg = 0;
	if (*buf == 0)
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
	char	*newbuf;
	int		len;

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

void ftFree(t_client *client) {
    if (client) {
        if (client->msg) free(client->msg);
        close(client->fd);
        free(client);
    }
}

void fatalError(t_server *server) {
    deleteAllClients(server);
    free(server);
    server = NULL;
    fprintf(stderr, "Fatal error\n");
    exit(1);
}

t_client *findClient(t_server *server, int fd) {
    if (server) {
        t_client *tmp = server->head;

        while (tmp && tmp->fd != fd)
            tmp = tmp->next;
        return tmp;
    }
    return NULL;
}

void deleteClient(t_server *server, int fd) {
    if (server) {
        t_client *tmp = server->head;
        t_client *prev = NULL;
        while (tmp && tmp->fd != fd) {
            prev = tmp;
            tmp = tmp->next;
        }
        if (tmp) {
            if (prev) {
                prev->next = tmp->next;
            } else {
                server->head = tmp->next;
            }
            ftFree(tmp);
        }
    }
}

void printClients(t_server *server) {
    t_client *tmp = server->head;

    while (tmp)
    {
        printf("%d\n", tmp->fd);
        tmp = tmp->next;
    }
}

void deleteAllClients(t_server *server) {
    if (server) {
        t_client *tmp = server->head;

        while (tmp)
        {
            t_client *cache = tmp->next;
            ftFree(tmp);
            tmp = cache;
        }
        server->head = NULL;
        free(server);
    }
}

t_client *addClient(t_server *server, int fd) {
    t_client *new_client = (t_client *)malloc(sizeof(t_client));

    if (!new_client) fatalError(server);
    new_client->client_no = server->counter++;
    new_client->fd = fd;
    new_client->msg = NULL;
    new_client->next = server->head;
    server->head = new_client;

    return (new_client);
}

void deregisterClient(t_server *server, int fd, int client_id) {
    char buf[256];
    sprintf(buf, "server: client %d just left\n", client_id);
    notifyAllClients(server, fd, buf);
    FD_CLR(fd, &server->activefds);
    deleteClient(server, fd);
}

void sendMessage(t_server *server, int fd, t_client *cli) {
    char buf[256];
    char *msg;
    while (extract_message(&(cli->msg), &msg))
    {
        sprintf(buf, "client %d: ", cli->client_no);
        notifyAllClients(server, fd, buf);
        notifyAllClients(server, fd, msg);
        free(msg);
    }
    
}

void processMessage(t_server *server, int fd) {
    t_client *cli = findClient(server, fd);
    if (!cli) return;

    char buffer[4096];
    int read_bytes = recv(fd, buffer, sizeof(buffer) - 1, 0);
    if (read_bytes <= 0)
    {
        deregisterClient(server, fd, cli->client_no);
    } else {
        buffer[read_bytes] = '\0';
        cli->msg = str_join(cli->msg, buffer);
        sendMessage(server, fd, cli);
    }
}

void handleConnections(t_server *server) {
    while (1)
    {
        server->readfds = server->activefds;
        server->writefds = server->activefds;
        monitorFDs(server);
    }
}

void monitorFDs(t_server *server) {
    if (select(server->maxfd + 1, &server->readfds, &server->writefds, NULL, NULL) < 0) fatalError(server);
    int fd = 0;
    while (fd <= server->maxfd)
    {
        if (FD_ISSET(fd, &server->readfds)) {
            if (fd == server->sockfd)
                acceptRegistration(server);
            else
                processMessage(server, fd);
        }
        fd++;
    }
}

void acceptRegistration(t_server *server) {
    struct sockaddr_in cli;
    socklen_t len;
    int connfd = accept(server->sockfd, (struct sockaddr *)&cli, &len);
	if (connfd < 0) fatalError(server);
    registerClient(server, connfd);
}

void registerClient(t_server *server, int connfd) {
    t_client *cli = addClient(server, connfd);
    char msg[257];

    if (cli) {
        FD_SET(cli->fd, &server->activefds);
        if (server->maxfd < connfd) server->maxfd = connfd;
        sprintf(msg, "server: client %d just arrived\n", cli->fd);
        notifyAllClients(server, connfd, msg);
    }
}

void notifyAllClients(t_server *server, int author_fd, char *msg) {
    t_client *cli = server->head;
    while (cli)
    {
        if (FD_ISSET(cli->fd, &server->writefds) && cli->fd != author_fd) {
            if (send(cli->fd, msg, strlen(msg), 0) < 0)    fatalError(server);
        }
        cli = cli->next;
    }
    
}

void bindAndListen(t_server *server) {
	if ((bind(server->sockfd, (const struct sockaddr *)&server->addr, sizeof(server->addr))) != 0)
        fatalError(server);
    if (listen(server->sockfd, SOMAXCONN) != 0)
		fatalError(server);
}

void configureAddress(t_server *server) {
	bzero(&server->addr, sizeof(struct sockaddr_in)); 
	server->addr.sin_family = AF_INET;
	server->addr.sin_addr.s_addr = htonl(2130706433);
	server->addr.sin_port = htons(server->port);
}

void createSocket(t_server *server) {
	server->sockfd = socket(AF_INET, SOCK_STREAM, 0); 
	if (server->sockfd < 0)
        fatalError(server);
    FD_SET(server->sockfd, &server->activefds);
    server->maxfd = server->sockfd;
}

t_server *initServer (int port) {
    t_server *server = (t_server *)malloc(sizeof(t_server));
    if (!server) fatalError(NULL);
    bzero(server, sizeof(t_server));
    FD_ZERO(&server->activefds);
    server->port = port;
    return (server);
}

int main(int ac, char **av) {
    if (ac != 2) {
        fprintf(stderr, "Wrong number of arguments\n");
        exit(1);
    }

    t_server *server = initServer(atoi(av[1]));
    createSocket(server);
    configureAddress(server);
    bindAndListen(server);
    handleConnections(server);
    // addClient(server, 8082);
    // addClient(server, 8081);
    // addClient(server, 8080);
    // deleteClient(server, 8082);
    // printClients(server);
    deleteAllClients(server);
    return (0);
}