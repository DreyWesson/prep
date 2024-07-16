#include "Stock.hpp"

Stock::Stock() : head(nullptr), tail(nullptr), size(0) {}

void Stock::addItemToStock(const std::string &name_, int quantity_, double price_)
{
    Items *newItem = new Items(name_, quantity_, price_);
    if (!head)
    {
        head = tail = newItem;
    }
    else
    {
        newItem->next = head;
        head = newItem;
    }
    size++;
}

Stock::Stock(const Stock &cpy) : head(nullptr), tail(nullptr), size(0)
{
    *this = cpy;
}

Items *Stock::getItem(std::string target)
{
    if (target.empty() || !head)
        return nullptr;
    Items *tmp = head;

    while (tmp && toLower(tmp->name) != toLower(target))
    {
        tmp = tmp->next;
    }
    return (tmp);
}

Stock &Stock::operator=(const Stock &cpy)
{
    if (this != &cpy)
    {
        clearItems();
        if (cpy.head)
        {
            head = new Items(*cpy.head);
            Items *tmp = head;
            while (tmp->next)
            {
                tmp = tmp->next;
            }
            tail = tmp;
            size = cpy.size;
        }
    }
    return *this;
}

Stock::~Stock()
{
    clearItems();
}

void Stock::clearItems()
{
    delete head;
    head = tail = nullptr;
    size = 0;
}

void Stock::printStockItems()
{
    std::cout << *this << std::endl;
}

void Stock::removeOneFromStock(std::string itemName)
{
    if (!head)
        return;
    Items *tmp = head;
    Items *prev = nullptr;

    while (tmp && toLower(tmp->name) != toLower(itemName))
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

    size--;

    tmp->next = nullptr;
    delete tmp;
}

std::ostream &operator<<(std::ostream &cout_, const Stock &src)
{
    Items *tmp = src.head;
    while (tmp)
    {
        std::cout << *tmp;
        tmp = tmp->next;
    }
    return (cout_);
};