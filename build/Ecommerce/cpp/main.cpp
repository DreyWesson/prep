#include "All.hpp"
#include "Item.hpp"
#include "Stock.hpp"
#include "PickedItems.hpp"
#include "Cart.hpp"
#include "Users.hpp"
#include "UserList.hpp"

int main(void)
{
    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;

    Stock *stock = new Stock();
    stock->addItemToStock("Apple", 31, 0.99);
    stock->addItemToStock("Banana", 51, 0.59);
    stock->addItemToStock("Cashew", 20, 2.99);
    stock->addItemToStock("Grape", 10, 0.99);

    UserList *users = new UserList();
    User *one = users->addUser("Dare", "secret", 100.19);

    (void)one;

    one->addToCart(*stock, "Apple", 8);
    one->addToCart(*stock, "Apple", 8);
    one->addToCart(*stock, "Cashew", 20);

    one->pay(*stock);
    std::cout << *(one->cart);
    // one->removeOnePickedItem("Applesadfsf");
    std::cout << "***" << std::endl;
    std::cout << "***" << std::endl;
    std::cout << *(one->cart);
    std::cout << *stock;
    // cout << *one;
    delete stock;
    // delete newCart;
    delete users;
    // delete newCart2;

    std::cout << std::endl;
    std::cout << std::endl;
    std::cout << std::endl;
    return (0);
}