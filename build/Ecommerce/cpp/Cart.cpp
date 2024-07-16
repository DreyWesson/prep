#include "Cart.hpp"

ShoppingCart::ShoppingCart() : head(nullptr), tail(nullptr), size(0), totalPrice(0.00)
{
}

ShoppingCart::ShoppingCart(const ShoppingCart &src)
{
    *this = src;
}

ShoppingCart &ShoppingCart::operator=(const ShoppingCart &src)
{
    if (this != &src)
    {
        head = new PickedItems(*src.head);
        PickedItems *tmp = head;
        while (tmp->next)
        {
            tmp = tmp->next;
        }
        tail = tmp;
        size = src.size;
        totalPrice = src.totalPrice;
    }
    return *this;
}

PickedItems *ShoppingCart::inCart(std::string &name)
{
    PickedItems *tmp = head;

    (void)name;
    while (tmp && toLower(tmp->itemName) != toLower(name))
        tmp = tmp->next;

    return tmp;
}

void ShoppingCart::removeFromCart(std::string name)
{
    if (!head)
        return;
    PickedItems *tmp = head;
    PickedItems *prev = nullptr;

    while (tmp && toLower(tmp->itemName) == toLower(name))
    {
        prev = tmp;
        tmp = tmp->next;
    }

    if (!tmp)
        return;

    if (tmp == head)
    {
        head = tmp->next;
    }
    else
    {
        prev->next = tmp->next;
    }

    if (tmp == tail)
        tail = tmp;

    size--;
    totalPrice -= (tmp->quantity * tmp->stockItem->price);

    tmp->next = nullptr;
    delete tmp;
}

void ShoppingCart::addToCart(Stock &stock, std::string name, int quantity)
{
    if (name.empty() || quantity <= 0)
        return;

    PickedItems *cartItem = inCart(name);
    if (cartItem)
    {
        cartItem->quantity += quantity;
        cartItem->totalPrice += quantity * cartItem->stockItem->price;
    }
    else
    {
        Items *targetItem = stock.getItem(name);

        if (!targetItem)
        {
            std::cout << "No " << name << " in stock" << std::endl;
            return;
        }

        if (quantity > targetItem->quantity)
        {
            std::cout << "Sorry, only " << targetItem->quantity << " " << name << " left in stock" << std::endl;
            return;
        }

        PickedItems *picked = new PickedItems(targetItem, quantity);

        if (!head)
        {
            head = tail = picked;
        }
        else
        {
            picked->next = head;
            head = picked;
        }
        size++;
        totalPrice += (quantity * picked->stockItem->price);
    }
}

void ShoppingCart::clearShoppingCart()
{
    delete head;
    head = tail = nullptr;
    size = 0;
    totalPrice = 0.00;
}

ShoppingCart::~ShoppingCart()
{
    clearShoppingCart();
}

std::ostream &operator<<(std::ostream &cout_, const ShoppingCart &src)
{
    PickedItems *tmp = src.head;
    while (tmp)
    {
        std::cout << *tmp;
        tmp = tmp->next;
    }
    return (cout_);
};
