#include <string.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct Item
{
    char name[100];
    int available_quant;
    double price;
    struct Item *next;
} Item;

typedef struct PickedItem
{
    Item *item;
    int quantity;
    char name[100];
    double total;
    struct PickedItem *next;
} PickedItem;

typedef struct AllItems
{
    Item *head;
    Item *tail;
    double totalValue;
} AllItems;

typedef struct Cart
{
    PickedItem *head;
    size_t size;
    double total_price;
} Cart;

typedef struct User
{
    char email[100];
    char password[100];
    Cart *cart;
    struct User *next;
} User;

typedef struct UserList {
    User *head;
    User *tail;
    int size;
} UserList;

Cart *createCart();
Item *createItem(char *name, int quant, double price);
void clearItems(Item *itemList);
void listStock(AllItems *all);
void clearStock(AllItems *items);
AllItems *removeItemFromStock(AllItems *allItems, char *target);
AllItems *addItemToStock(AllItems *allItems, Item *item);
AllItems *createStock();
Cart *addItemToCart(AllItems *all, User *user, char *itemName, int quantity);
PickedItem *getItemFromCart(Cart *cart, char *itemName);
Item *getItemFromStock(AllItems *all, char *itemName);
void updateStockItem(AllItems *all, char *name, int newQuant, int newPrice);
void listCartItems(Cart *cart);
AllItems *pay(AllItems *all, User *user);
int confirmUser(User *user);
void deleteShoppingCart(Cart *cart);
UserList *createUserList();
User * addUser(UserList *userList);
void printUsers(UserList *list);
void deleteAllUsers(UserList *users);
