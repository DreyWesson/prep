#include "ecommerce.h"

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

Cart *addItemToCart(AllItems *all, User *user, char *itemName, int quantity)
{
    if (!user) return  NULL;
    Cart *cart = user->cart;
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
