#include "Item.hpp"

Items::Items(const std::string &name_, int quantity_, double price_)
    : name(name_), quantity(quantity_), price(price_), next(nullptr) {}

Items::~Items()
{
    delete next;
}

Items::Items(const Items &cpy)
    : name(cpy.name), quantity(cpy.quantity), price(cpy.price), next(nullptr)
{
    next = (cpy.next) ? new Items(*cpy.next) : nullptr;
}

Items &Items::operator=(const Items &cpy)
{
    if (this != &cpy)
    {
        delete next;
        next = nullptr;

        name = cpy.name;
        quantity = cpy.quantity;
        price = cpy.price;

        next = (cpy.next) ? new Items(*cpy.next) : nullptr;
    }
    return *this;
}

std::ostream &operator<<(std::ostream &cout_, const Items &src)
{
    std::cout << src.name << " | " << src.quantity << " | " << src.price << " = " << src.quantity * src.price << std::endl;
    return cout_;
}
