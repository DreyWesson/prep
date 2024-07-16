#ifndef PICKEDITEMS_HPP
# define PICKEDITEMS_HPP

#include "All.hpp"
#include "Item.hpp"

class PickedItems
{
public:
    Items *stockItem;
    std::string itemName;
    int quantity;
    double totalPrice;
    PickedItems *next;

    PickedItems(Items *stockItem_, int quantity_);
    PickedItems(const PickedItems &src);

    PickedItems &operator=(const PickedItems &src);

    ~PickedItems();
};

std::ostream &operator<<(std::ostream &cout_, const PickedItems &src);

#endif