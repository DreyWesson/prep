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
Cart *addItemToCart(AllItems *all, Cart *cart, char *itemName, int quantity);
PickedItem *getItemFromCart(Cart *cart, char *itemName);
Item *getItemFromStock(AllItems *all, char *itemName);
void updateStockItem(AllItems *all, char *name, int newQuant, int newPrice);
void listCartItems(Cart *cart);
AllItems *pay(AllItems *all, Cart *cart);

AllItems *createStock()
{
    AllItems *all = (AllItems *)malloc(sizeof(AllItems));

    if (!all)
        return NULL;

    all->head = all->tail = NULL;
    all->totalValue = 0.00;
    return all;
}

AllItems *addItemToStock(AllItems *allItems, Item *item)
{
    if (!item)
        return allItems;
    if (!allItems)
    {
        allItems = createStock();
        if (!allItems)
            return NULL;
    }
    if (!allItems->head)
    {
        allItems->head = allItems->tail = item;
    }
    else
    {
        item->next = allItems->head;
        allItems->head = item;
    }
    allItems->totalValue += (item->available_quant * item->price);
    return allItems;
}

AllItems *removeItemFromStock(AllItems *allItems, char *target)
{
    if (!target)
        return NULL;
    if (!allItems || !allItems->head)
        return NULL;

    Item *tmp = allItems->head;
    Item *prev = NULL;

    while (tmp)
    {
        if (strcmp(tmp->name, target) == 0)
        {
            if (tmp == allItems->head)
            {
                allItems->head = tmp->next;
                if (tmp == allItems->tail)
                    allItems->tail = NULL;
            }
            else
            {
                prev->next = tmp->next;
                if (tmp == allItems->tail)
                    allItems->tail = prev;
            }
            allItems->totalValue -= (tmp->price * tmp->available_quant);
            free(tmp);
            break;
        }
        prev = tmp;
        tmp = tmp->next;
    }

    return allItems;
}

Cart *removeItemFromCart(Cart *cart, char *target)
{
    if (!target || !cart || !cart->head)
        return NULL;

    PickedItem *tmp = cart->head;
    PickedItem *prev = NULL;

    while (tmp)
    {
        if (strcmp(tmp->item->name, target) == 0)
        {
            if (tmp == cart->head)
                cart->head = tmp->next;
            else
                prev->next = tmp->next;
            free(tmp);
            tmp = prev->next;
            break;
        }
        prev = tmp;
        tmp = tmp->next;
    }

    return cart;
}

void clearStock(AllItems *items)
{
    if (items)
    {
        if (items->head)
            clearItems(items->head);
        free(items);
    }
}

void listStock(AllItems *all)
{
    if (all && all->head)
    {
        Item *tmp = all->head;
        if (tmp)
        {
            while (tmp)
            {
                printf("%s %d %f\n", tmp->name, tmp->available_quant, tmp->price);
                tmp = tmp->next;
            }
            return;
        }
    }
    printf("No Item(s) In Stock!\n");
}

void clearItems(Item *itemList)
{
    if (itemList)
    {
        Item *tmp = itemList;
        while (tmp)
        {
            Item *cache = tmp->next;
            free(tmp);
            tmp = cache;
        }
    }
}

Item *createItem(char *name, int quant, double price)
{
    Item *item = (Item *)malloc(sizeof(Item));

    if (!item)
        return NULL;
    strcpy(item->name, name);
    item->name[sizeof(item->name) - 1] = '\0';
    item->available_quant = quant;
    item->price = price;
    item->next = NULL;

    return item;
}

Cart *createCart()
{
    Cart *cart = (Cart *)malloc(sizeof(Cart));
    if (!cart)
        return NULL;
    cart->head = NULL;
    cart->size = 0;
    cart->total_price = 0.00;
    return cart;
}

Item *getItemFromStock(AllItems *all, char *itemName)
{
    if (!all || !all->head)
        return NULL;
    Item *tmp = all->head;

    while (tmp)
    {
        if (strcmp(tmp->name, itemName) == 0)
        {
            printf("%d %s(s) left in stock\n", tmp->available_quant, tmp->name);
            return tmp;
        }
        tmp = tmp->next;
    }
    printf("Item not found\n");
    return NULL;
}

PickedItem *getItemFromCart(Cart *cart, char *itemName)
{
    if (!cart || !cart->head)
        return NULL;
    PickedItem *tmp = cart->head;

    while (tmp)
    {
        if (tmp->item && strcmp(tmp->item->name, itemName) == 0)
            return tmp;
        tmp = tmp->next;
    }

    return NULL;
}
PickedItem *createPickedItem(Item *item, int quantity)
{
    PickedItem *cartItem = (PickedItem *)malloc(sizeof(PickedItem));
    if (!cartItem)
        return NULL;

    strcpy(cartItem->name, item->name);
    cartItem->item = item;
    cartItem->quantity = quantity;
    cartItem->total = quantity * item->price;
    cartItem->next = NULL;

    return cartItem;
}

void updatePickedItem(PickedItem *cartItem, int newQuant, double newPrice)
{
    if (cartItem && newQuant && newPrice)
    {
        cartItem->quantity = newQuant;
        cartItem->total = newQuant * newPrice;
    }
}

Cart *addItemToCart(AllItems *all, Cart *cart, char *itemName, int quantity)
{
    if (!all || !all->head || quantity <= 0 || !itemName)
        return NULL;

    if (!cart)
    {
        cart = createCart();
        if (!cart)
            return NULL;
    }
    Item *item = getItemFromStock(all, itemName);
    if (!item)
        return (printf("We are out of stock for %s\n", itemName), cart);
    if (item->available_quant < quantity)
        return (printf("Sorry, only %d %s(s) left in stock\n", item->available_quant, item->name), cart);
    
    PickedItem *cartItem = getItemFromCart(cart, itemName);
    if (!cartItem)
    {
        PickedItem *pickedItem = createPickedItem(item, quantity);
        if (!pickedItem)
            return cart;
        pickedItem->next = cart->head;
        cart->head = pickedItem;
        cart->total_price += pickedItem->total;
        cart->size++;
    }
    else
        updatePickedItem(cartItem, quantity, item->price);

    return cart;
}

void listCartItems(Cart *cart)
{
    if (!cart || !cart->head)
        return;
    PickedItem *items = cart->head;
    while (items)
    {
        printf("%d %s %f\n", items->quantity, items->item->name, items->total);
        items = items->next;
    }
}

void deleteShoppingCart(Cart *cart)
{
    if (cart != NULL)
    {
        printf("Deleting shopping cart...\n");
        PickedItem *current = cart->head;
        while (current)
        {
            PickedItem *next = current->next;
            printf("Deleting picked item: %s\n", current->name);
            free(current);
            current = next;
        }
        free(cart);
        printf("Shopping cart now empty\n");
    }
    else
    {
        printf("Cart is NULL, nothing to delete.\n");
    }
}

void updateStockItem(AllItems *all, char *name, int newQuant, int newPrice)
{
    if (!all || !all->head)
        return;
    Item *tmp = all->head;

    while (tmp)
    {
        if (strcmp(tmp->name, name) == 0)
        {

            tmp->available_quant = newQuant;
            tmp->price = newPrice;
            printf("%s(s) updated in stock\n", tmp->name);
            return;
        }
        tmp = tmp->next;
    }
    printf("Item not found\n");
}

AllItems *pay(AllItems *all, Cart *cart)
{
    PickedItem *pickedItems = cart->head;
    double total = cart->total_price;

    printf("\nGenerating receipt\n");
    while (pickedItems)
    {
        int stockLeft = pickedItems->item->available_quant - pickedItems->quantity;
        printf("    %s - %d * %f = %f\n", pickedItems->item->name, pickedItems->quantity, pickedItems->item->price, pickedItems->total);
        (void)stockLeft;
        updateStockItem(all, pickedItems->item->name, stockLeft, pickedItems->item->price);
        if (stockLeft == 0)
        {
            removeItemFromStock(all, pickedItems->item->name);
        }

        pickedItems = pickedItems->next;
    }
    printf("Total Price = %f\nThanks for shopping with us!\n\n", total);
    return all;
}

User *createUser() {
    User *user = (User *)malloc(sizeof(User));
    if (!user) return NULL;

    printf("Please, enter your email\n");
    while (1)
    {
        scanf("%s", user->email);
        if (strlen(user->email) > 0)
            break;
        else
            printf("Email can't be empty. Please enter your email\n");
    }
    
    printf("Please, enter your password\n");
    while (1)
    {
        scanf("%s", user->password);
        if (strlen(user->password) > 0)
            break;
        else
            printf("Password can't be empty. Please enter your password\n");
    }
    user->cart = createCart();
    user->next = NULL;
    return user;
}

UserList *createUserList() {
    UserList *users = (UserList *)malloc(sizeof(UserList));
    if (!users) return NULL;

    users->head = users->tail = 0;
    users->size = 0;

    return users;
}

User * addUser(UserList *userList) {
    if (!userList) {
        userList = createUserList();
        if (!userList) return NULL;
    }
    User *user = createUser();
    if (!user) return NULL;

    if (!userList->head) {
        userList->head = userList->tail = user;
    } else {
        user->next = userList->head;
        userList->head = user;
    }
    userList->size++;
    return user;
}

void printUsers(UserList *list) {
    if (!list) return ;

    User *tmp = list->head;
    printf("\n");
    while (tmp)
    {
        printf("email: %s\npassword: %s\n", tmp->email, tmp->password);
        listCartItems(tmp->cart);
        
        tmp = tmp->next;
    }
    printf("\n");
}

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

    addItemToCart(allItems, one->cart, "Orange", 20);
    addItemToCart(allItems, one->cart, "Grape", 5);
    printUsers(allUsers);
    // listCartItems(cart);
    // pay(allItems, cart);
    // printf("\n\n");

    // deleteShoppingCart(cart);
    // listStock(allItems);
    clearStock(allItems);
    return 0;
}
