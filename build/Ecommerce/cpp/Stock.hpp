#ifndef STOCK_HPP
# define STOCK_HPP

#include "All.hpp"
#include "Item.hpp"

class Stock
{
public:
    Items *head;
    Items *tail;
    size_t size;

    Stock();
    Stock(const Stock &cpy);
    Stock &operator=(const Stock &cpy);
    ~Stock();

    void addItemToStock(const std::string &name_, int quantity_, double price_);
    Items *getItem(std::string target);
    void clearItems();
    void printStockItems();
    void removeOneFromStock(std::string itemName);
};

std::ostream &operator<<(std::ostream &cout_, const Stock &src);

#endif
