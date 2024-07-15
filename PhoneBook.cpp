#include <iostream>
using namespace std;
class Items;
class Stock;
ostream &operator<<(ostream &cout_, const Stock &src);
ostream &operator<<(ostream &cout_, const Items &src);

class Items
{
public:
    std::string name;
    int quantity;
    double price;
    Items *next;

    Items(const string &name_, int quantity_, double price_)
        : name(name_), quantity(quantity_), price(price_), next(nullptr) {}
    ~Items() {}
};
ostream &operator<<(ostream &cout_, const Items &src) {
    cout << src.name << " | " << src.quantity << " | " << src.price << " = " << src.quantity * src.price << endl;
    return cout_;
}

class Stock
{
public:
    Items *head;
    Items *tail;
    size_t size;

    Stock() : head(nullptr), tail(nullptr), size(0)
    {
    }
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

    Stock(const Stock &cpy)
    {
        *this = cpy;
    }

    Stock &operator=(const Stock &cpy)
    {
        if (this != &cpy)
        {
            clearItems();
            copyItems(cpy);
        }
        return *this;
    }

    void printStockItems()
    {
        cout << *this << endl;
    }

    ~Stock()
    {
        clearItems();
    }

    void clearItems()
    {
        if (!head)
            return;
        Items *tmp = head;
        Items *cache = NULL;
        while (tmp)
        {
            cache = tmp;
            tmp = tmp->next;
            delete cache;
        }
        head = tail = nullptr;
        size = 0;
    }
    
    void copyItems(const Stock &cpy)
    {
        if (!cpy.head)
            return;

        Items *incoming = cpy.head;
        head = new Items(incoming->name, incoming->quantity, incoming->price);
        incoming = incoming->next;
        Items *tmp = head;
        while (incoming)
        {
            tmp->next = new Items(incoming->name, incoming->quantity, incoming->price);
            tmp = tmp->next;
            incoming = incoming->next;
        }
        size = cpy.size;
        tail = tmp;
    }


    void updateStock(){
        
    }

    void removeOneFromStock(const string &itemName){
        if (!head) return ;
        Items *tmp = head;
        Items *prev = nullptr;
        while (tmp && tmp->name != itemName)
        {
            prev = tmp;
            tmp = tmp->next;
        }
        if (tmp) {
            if (tmp == head) {
                head = head->next;
                if (!head)
                    tail = nullptr;
            } else {
                prev->next = tmp->next;
                if (!prev->next) {
                    tail = prev;
                }
            }
            delete tmp;
            size--;
        }

    }
};

ostream &operator<<(ostream &cout_, const Stock &src) {
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
    // Stock *stock2 = new Stock();
    stock->addItemToStock("Apple", 31, 0.99);
    stock->addItemToStock("Banana", 51, 0.59);
    stock->addItemToStock("Cashew", 20, 2.99);
    stock->addItemToStock("Grape", 10, 0.99);
    stock->removeOneFromStock("Grape");

    // *stock2 = *stock;

    cout << *stock;
    // stock2->printStockItems();


    stock->clearItems();
    // stock2->clearItems();
    delete stock;
    // delete stock2;
    (void)stock;

    cout << endl;
    cout << endl;
    cout << endl;
    return (0);
}