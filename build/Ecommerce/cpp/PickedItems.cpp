#include "PickedItems.hpp"

PickedItems::PickedItems(Items *stockItem_, int quantity_) : stockItem(stockItem_), quantity(quantity_)
{
    itemName = stockItem->name;
    totalPrice = quantity * stockItem->price;
    next = nullptr;
}

PickedItems::PickedItems(const PickedItems &src) : stockItem(src.stockItem), itemName(src.itemName), quantity(src.quantity), totalPrice(src.totalPrice), next(nullptr)
{
    if (src.next)
        next = new PickedItems(*src.next);
}

PickedItems &PickedItems::operator=(const PickedItems &src)
{
    if (this != &src)
    {
        delete next;
        next = nullptr;

        stockItem = src.stockItem;
        itemName = src.itemName;
        quantity = src.quantity;
        totalPrice = src.totalPrice;

        next = (src.next) ? new PickedItems(*src.next) : nullptr;
    }

    return *this;
}

PickedItems::~PickedItems()
{
    delete next;
}

std::ostream &operator<<(std::ostream &cout_, const PickedItems &src)
{
    std::cout << "Item-Name: " << src.stockItem->name
         << "\nQuantity: " << src.quantity << "\nSum: " << src.totalPrice << std::endl
         << std::endl;
    return cout_;
}
