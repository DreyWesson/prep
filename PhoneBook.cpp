#include <iostream>
#include <algorithm>
#include <cctype>
using namespace std;

string toLower(string &str)
{
    std::transform(str.begin(), str.end(), str.begin(), [](unsigned char c)
                   { return tolower(c); });
    return str;
}

class Items;
class Stock;
class PickedItems;
class ShoppingCart;
ostream &operator<<(ostream &cout_, const Stock &src);
ostream &operator<<(ostream &cout_, const Items &src);
ostream &operator<<(ostream &cout_, const PickedItems &src);
ostream &operator<<(ostream &cout_, const ShoppingCart &src);

class Items
{
public:
    std::string name;
    int quantity;
    double price;
    Items *next;

    Items(const string &name_, int quantity_, double price_)
        : name(name_), quantity(quantity_), price(price_), next(nullptr) {}

    ~Items()
    {
        delete next;
    }

    Items(const Items &cpy)
        : name(cpy.name), quantity(cpy.quantity), price(cpy.price), next(nullptr)
    {
        if (cpy.next)
            next = new Items(*cpy.next);
    }

    Items &operator=(const Items &cpy)
    {
        if (this == &cpy)
            return *this;

        delete next;
        next = nullptr;

        name = cpy.name;
        quantity = cpy.quantity;
        price = cpy.price;

        if (cpy.next)
        {
            next = new Items(*cpy.next);
        }
        return *this;
    }
};

class Stock
{
public:
    Items *head;
    Items *tail;
    size_t size;

    Stock() : head(nullptr), tail(nullptr), size(0) {}

    void addItemToStock(const string &name_, int quantity_, double price_)
    {
        Items *newItem = new Items(name_, quantity_, price_);
        if (!head)
        {
            head = tail = newItem;
        }
        else
        {
            newItem->next = head;
            head = newItem;
        }
        size++;
    }

    Stock(const Stock &cpy) : head(nullptr), tail(nullptr), size(0)
    {
        *this = cpy;
    }

    Items *getItem(string target)
    {
        if (target.empty() || !head)
            return nullptr;
        Items *tmp = head;

        while (tmp && toLower(tmp->name) != toLower(target))
        {
            tmp = tmp->next;
        }
        return (tmp);
    }

    Stock &operator=(const Stock &cpy)
    {
        if (this != &cpy)
        {
            clearItems();
            if (cpy.head)
            {
                head = new Items(*cpy.head);
                Items *tmp = head;
                while (tmp->next)
                {
                    tmp = tmp->next;
                }
                tail = tmp;
                size = cpy.size;
            }
        }
        return *this;
    }

    ~Stock()
    {
        clearItems();
    }

    void clearItems()
    {
        delete head;
        head = tail = nullptr;
        size = 0;
    }

    void printStockItems()
    {
        cout << *this << endl;
    }

    void removeOneFromStock(const string &itemName)
    {
        if (!head)
            return;
        Items *tmp = head;
        Items *prev = nullptr;
        while (tmp && tmp->name != itemName)
        {
            prev = tmp;
            tmp = tmp->next;
        }
        if (tmp)
        {
            if (tmp == head)
            {
                head = head->next;
                if (!head)
                    tail = nullptr;
            }
            else
            {
                prev->next = tmp->next;
                if (!prev->next)
                {
                    tail = prev;
                }
            }
            tmp->next = nullptr;
            delete tmp;
            size--;
        }
    }
};

class PickedItems
{
public:
    Items *stockItem;
    string itemName;
    int quantity;
    double totalPrice;
    PickedItems *next;
    PickedItems(Items *stockItem_, int quantity_) : stockItem(stockItem_), quantity(quantity_)
    {
        itemName = stockItem->name;
        totalPrice = quantity * stockItem->price;
        next = nullptr;
    }

    PickedItems(const PickedItems &src) : stockItem(src.stockItem), itemName(src.itemName), quantity(src.quantity), totalPrice(src.totalPrice), next(nullptr)
    {
        if (src.next)
            next = new PickedItems(*src.next);
    }

    PickedItems &operator=(const PickedItems &src)
    {
        if (this != &src)
        {
            delete next;
            next = nullptr;

            stockItem = src.stockItem;
            itemName = src.itemName;
            quantity = src.quantity;
            totalPrice = src.totalPrice;
            if (src.next)
            {
                next = new PickedItems(*src.next);
            }
        }

        return *this;
    }

    ~PickedItems()
    {
        delete next;
    }
};

class ShoppingCart
{
public:
    PickedItems *head;
    PickedItems *tail;
    int size;
    double totalPrice;

    ShoppingCart() : head(nullptr), tail(nullptr), size(0), totalPrice(0.00)
    {
    }

    ShoppingCart(const ShoppingCart &src)
    {
        *this = src;
    }

    ShoppingCart &operator=(const ShoppingCart &src)
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

    void addToCart(Stock &stock, const string name, int quantity)
    {
        if (name.empty() || quantity <= 0)
            return;

        Items *targetItem = stock.getItem(name);

        PickedItems picked(targetItem, quantity);
        cout << picked;

        (void)quantity;
        (void)targetItem;
    }

    void clearShoppingCart()
    {
        delete head;
        head = tail = nullptr;
        size = 0;
        totalPrice = 0.00;
    }

    ~ShoppingCart()
    {
        clearShoppingCart();
    }
};

ostream &operator<<(ostream &cout_, const PickedItems &src)
{

    cout << "Item-Name: " << src.stockItem->name
         << "\nQuantity: " << src.quantity << "\nSum: " << src.totalPrice << endl
         << endl;
    return cout_;
}

ostream &operator<<(ostream &cout_, const ShoppingCart &src)
{
    PickedItems *tmp = src.head;
    while (tmp)
    {
        cout << *tmp;
        tmp = tmp->next;
    }
    return (cout_);
};

ostream &operator<<(ostream &cout_, const Items &src)
{
    cout << src.name << " | " << src.quantity << " | " << src.price << " = " << src.quantity * src.price << endl;
    return cout_;
}

ostream &operator<<(ostream &cout_, const Stock &src)
{
    Items *tmp = src.head;
    while (tmp)
    {
        cout << *tmp;
        tmp = tmp->next;
    }
    return (cout_);
};

int main(void)
{
    cout << endl;
    cout << endl;
    cout << endl;

    Stock *stock = new Stock();
    stock->addItemToStock("Apple", 31, 0.99);
    stock->addItemToStock("Banana", 51, 0.59);
    stock->addItemToStock("Cashew", 20, 2.99);
    stock->addItemToStock("Grape", 10, 0.99);
    stock->removeOneFromStock("Grape");

    ShoppingCart *newCart = new ShoppingCart();
    newCart->addToCart(*stock, "Cashew", 10);

    stock->clearItems();
    delete stock;
    delete newCart;
    cout << endl;
    cout << endl;
    cout << endl;
    return (0);
}