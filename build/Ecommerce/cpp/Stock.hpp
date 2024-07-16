#ifndef STOCK_HPP
# define STOCK_HPP

#include "All.hpp"
#include "Item.hpp"

// class Items;

class Stock
{
public:
    Items *head;
    Items *tail;
    size_t size;

    Stock();

    void addItemToStock(const std::string &name_, int quantity_, double price_);

    Stock(const Stock &cpy);

    Items *getItem(std::string target);

    Stock &operator=(const Stock &cpy);

    ~Stock();

    void clearItems();

    void printStockItems();

    void removeOneFromStock(std::string itemName);
};

std::ostream &operator<<(std::ostream &cout_, const Stock &src);

#endif
