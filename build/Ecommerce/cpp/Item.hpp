#ifndef ITEMS_HPP
# define ITEMS_HPP

#include "All.hpp"

class Items
{
public:
    std::string name;
    int quantity;
    double price;
    Items *next;

    Items(const std::string &name_, int quantity_, double price_);
    Items(const Items &cpy);
    Items &operator=(const Items &cpy);
    ~Items();
};

std::ostream &operator<<(std::ostream &cout_, const Items &src);

#endif
