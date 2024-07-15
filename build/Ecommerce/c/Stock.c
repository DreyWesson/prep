#include "ecommerce.h"

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
