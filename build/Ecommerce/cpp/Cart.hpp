#ifndef CART_HPP
# define CART_HPP

#include "All.hpp"
#include "PickedItems.hpp"
#include "Stock.hpp"

class ShoppingCart
{
public:
    PickedItems *head;
    PickedItems *tail;
    Stock *stock;
    int size;
    double totalPrice;

    ShoppingCart();
    ShoppingCart(const ShoppingCart &src);
    ShoppingCart &operator=(const ShoppingCart &src);
    ~ShoppingCart();

    PickedItems *inCart(std::string &name);
    void removeFromCart(std::string name);
    void addToCart(std::string name, int quantity);
    void clearShoppingCart();
};
std::ostream &operator<<(std::ostream &cout_, const ShoppingCart &src);

#endif