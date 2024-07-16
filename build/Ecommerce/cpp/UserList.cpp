#include "UserList.hpp"

UserList::UserList() : head(nullptr), tail(nullptr), size(0) {}

UserList::UserList(const UserList &src)
{
    *this = src;
}

UserList &UserList::operator=(const UserList &src)
{
    if (this != &src)
    {
        head = new User(*src.head);
        User *tmp = head;
        while (tmp->next)
        {
            tmp = tmp->next;
        }
        tail = tmp;
        size = src.size;
    }
    return *this;
}

UserList::~UserList()
{
    clearUserList();
}
void UserList::clearUserList()
{
    delete head;
    head = tail = nullptr;
    size = 0;
}

User *UserList::addUser(const std::string &name_, const std::string &password_, const double wallet_)
{
    User *newUser = new User(name_, password_, wallet_);
    newUser->cart = new ShoppingCart();

    if (!head)
    {
        head = tail = newUser;
    }
    else
    {
        newUser->next = head;
        head = newUser;
    }
    size++;
    return newUser;
}

void UserList::removeOneUser(std::string userName)
{
    if (!head)
        return;

    User *tmp = head;
    User *prev = nullptr;

    while (tmp && toLower(tmp->name) != toLower(userName))
    {
        prev = tmp;
        tmp = tmp->next;
    }
    if (!tmp)
        return;

    if (tmp == head)
        head = tmp->next;
    else
        prev->next = tmp->next;

    if (tmp == tail)
        tail = prev;

    tmp->next = nullptr;
    delete tmp;
}

std::ostream &operator<<(std::ostream &cout_, const UserList &src)
{
    User *tmp = src.head;
    while (tmp)
    {
        std::cout << *tmp;
        tmp = tmp->next;
    }
    return (cout_);
};
