#include "ecommerce.h"

int main(void)
{
    AllItems *allItems = createStock();
    addItemToStock(allItems, createItem("Apple", 20, 1.99));
    addItemToStock(allItems, createItem("Banana", 10, 0.99));
    addItemToStock(allItems, createItem("Cashew", 3, 2.99));
    addItemToStock(allItems, createItem("Grape", 5, 1.50));
    addItemToStock(allItems, createItem("Orange", 31, 0.50));
    UserList *allUsers = createUserList();
    User *one = addUser(allUsers);
    User *two = addUser(allUsers);
    (void)one;
    (void)two;

    addItemToCart(allItems, one, "Orange", 20);
    addItemToCart(allItems, one, "Grape", 5);
    printUsers(allUsers);

    pay(allItems, one);
    printf("\n\n");
    addItemToCart(allItems, two, "Grape", 5);
    printf("\n\n");

    listStock(allItems);

    deleteAllUsers(allUsers);
    clearStock(allItems);
    return 0;
}
