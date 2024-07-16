#ifndef CART_HPP
# define CART_HPP

#include "All.hpp"
#include "PickedItems.hpp"
#include "Stock.hpp"

// class PickedItems;
class ShoppingCart
{
public:
    PickedItems *head;
    PickedItems *tail;
    int size;
    double totalPrice;

    ShoppingCart();

    ShoppingCart(const ShoppingCart &src);

    ShoppingCart &operator=(const ShoppingCart &src);

    PickedItems *inCart(std::string &name);

    void removeFromCart(std::string name);

    void addToCart(Stock &stock, std::string name, int quantity);

    void clearShoppingCart();

    ~ShoppingCart();
};
std::ostream &operator<<(std::ostream &cout_, const ShoppingCart &src);

#endif