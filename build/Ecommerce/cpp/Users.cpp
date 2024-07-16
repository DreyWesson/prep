#include "Users.hpp"

User::User(const std::string &name_, const std::string &password_, const double wallet_) : name(name_), password(password_), wallet(wallet_), next(nullptr) {}

User::User(const User &src) : name(src.name), password(src.password), wallet(src.wallet), cart(src.cart)
{
    if (src.next)
    {
        next = new User(*src.next);
    }
}

User &User::operator=(const User &src)
{
    if (this != &src)
    {
        delete next;
        next = nullptr;
        cart = (src.cart) ? new ShoppingCart(*src.cart) : nullptr;
        next = (src.next) ? new User(*src.next) : nullptr;
    }
    return *this;
}

PickedItems *User::inCart(std::string &name)
{
    PickedItems *tmp = cart->head;

    (void)name;
    while (tmp && toLower(tmp->itemName) != toLower(name))
        tmp = tmp->next;

    return tmp;
}

void User::addToCart(Stock &stock, std::string name, int quantity)
{
    if (name.empty() || quantity <= 0)
        return;

    PickedItems *cartItem = inCart(name);
    if (cartItem)
    {
        cartItem->quantity += quantity;
        cartItem->totalPrice += quantity * cartItem->stockItem->price;
    }
    else
    {
        Items *targetItem = stock.getItem(name);

        if (!targetItem)
        {
            std::cout << "No " << name << " in stock" << std::endl;
            return;
        }

        if (quantity > targetItem->quantity)
        {
            std::cout << "Sorry, only " << targetItem->quantity << " " << name << " left in stock" << std::endl;
            return;
        }

        PickedItems *picked = new PickedItems(targetItem, quantity);

        if (!cart->head)
        {
            cart->head = cart->tail = picked;
        }
        else
        {
            picked->next = cart->head;
            cart->head = picked;
        }
        cart->size++;
        cart->totalPrice += (quantity * picked->stockItem->price);
    }
}

void User::pay(Stock &stock)
{
    if (wallet < cart->totalPrice)
    {
        std::cout << "Insufficient funds" << std::endl;
        return;
    }

    PickedItems *tmp = cart->head;

    while (tmp)
    {
        Items *stockItem = stock.getItem(tmp->stockItem->name);

        if (!stockItem)
        {
            std::cout << "We are out of stock for " << tmp->stockItem->name << std::endl;
            tmp = tmp->next;
            continue;
        }

        if (stockItem->quantity >= tmp->quantity)
        {
            stockItem->quantity -= tmp->quantity;
            wallet -= tmp->totalPrice;

            std::string itemName = tmp->itemName;
            tmp = tmp->next;
            removeOnePickedItem(itemName);

            if (stockItem->quantity == 0)
            {
                stock.removeOneFromStock(stockItem->name);
            }
        }
        else
        {
            std::cout << "Sorry, only " << stockItem->quantity << " of " << stockItem->name << " left in stock" << std::endl;
            tmp = tmp->next;
        }
    }
}

void User::removeOnePickedItem(std::string &itemName)
{
    if (!cart->head)
        return;

    PickedItems *tmp = cart->head;
    PickedItems *prev = nullptr;

    while (tmp && toLower(tmp->itemName) != toLower(itemName))
    {
        prev = tmp;
        tmp = tmp->next;
    }

    if (!tmp)
        return;

    if (tmp == cart->head)
        cart->head = tmp->next;
    else
        prev->next = tmp->next;

    if (tmp == cart->tail)
        cart->tail = prev;

    cart->size--;
    cart->totalPrice -= (tmp->quantity * tmp->stockItem->price);

    tmp->next = nullptr;
    delete tmp;
}

User::~User()
{
    delete cart;
    delete next;
}

std::ostream &operator<<(std::ostream &cout_, const User &src)
{

    std::cout << "Name: " << src.name
         << "\nPassword: " << src.password << "\nWallet: " << src.wallet << std::endl
         << std::endl;
    if (src.cart)
        std::cout << *(src.cart);
    return cout_;
}
