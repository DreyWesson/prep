#include "ecommerce.h"

AllItems *pay(AllItems *all, User *user)
{
    if (!user) return NULL;
    if (confirmUser(user) == 0)
        return (printf("Wrong email or password\n"), all);
    Cart *cart = user->cart;
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

int confirmUser(User *user) {
    char email[100];
    char password[100];
    printf("We need to authenticate.\nPlease enter your email\n");
    while (1)
    {
        scanf("%s", email);
        if (strlen(email) > 0)
            break;
        else
            printf("Email can't be empty. Please enter your email\n");
    }
    
    printf("Please, enter your password\n");
    while (1)
    {
        scanf("%s", password);
        if (strlen(password) > 0)
            break;
        else
            printf("Password can't be empty. Please enter your password\n");
    }
    if (!strcmp(user->email, email) && !strcmp(user->password, password)) {
        return (printf("User authenticated!\n"), 1);
    }

    return 0;
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
        printf("Cart Items:\n");
        listCartItems(tmp->cart);
        printf("\n");
        tmp = tmp->next;
    }
    printf("\n");
}

void deleteAllUsers(UserList *users) {
    if (users) {
        User *tmp = users->head;
        if (tmp) {
            while (tmp)
            {
                User *cache = tmp->next;
                deleteShoppingCart(tmp->cart);
                free(tmp);
                tmp = cache;
            }
        }
        free(users);
    }
}
