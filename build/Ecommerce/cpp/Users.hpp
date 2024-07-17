#ifndef USERS_HPP
# define USERS_HPP

#include "All.hpp"
#include "Cart.hpp"
#include "Stock.hpp"

class User
{
public:
    std::string name;
    std::string password;
    double wallet;
    ShoppingCart *cart;
    User *next;

    User(const std::string &name_, const std::string &password_, const double wallet_);
    User(const User &src);
    User &operator=(const User &src);
    ~User();
    
    PickedItems *inCart(std::string &name);
    void addToCart(Stock &stock, std::string name, int quantity);
    void pay(Stock &stock);
    void removeOnePickedItem(std::string &itemName);
};

std::ostream &operator<<(std::ostream &cout_, const User &src);

#endif
