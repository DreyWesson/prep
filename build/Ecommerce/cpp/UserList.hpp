#ifndef USERLIST_HPP
# define USERLIST_HPP

#include "All.hpp"
#include "Users.hpp"

class UserList
{
public:
    User *head;
    User *tail;
    int size;
    UserList();

    UserList(const UserList &src);

    UserList &operator=(const UserList &src);

    ~UserList();
    void clearUserList();

    User *addUser(const std::string &name_, const std::string &password_, const double wallet_);

    void removeOneUser(std::string userName);
};

std::ostream &operator<<(std::ostream &cout_, const UserList &src);

#endif
