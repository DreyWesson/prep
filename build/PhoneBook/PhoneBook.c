#include <string.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct Contact
{
    char name[100];
    char phone_no[20];
    struct Contact *next;
} Contact;

typedef struct
{
    Contact *head;
    Contact *tail;
    size_t size;

} PhoneBook;

PhoneBook *createPhoneBook();
Contact *createContact(const char *name, const char *phone_no);
PhoneBook *appendContact(PhoneBook *pb, const char *name, const char *phone_no);
PhoneBook *prependContact(PhoneBook *pb, const char *name, const char *phone_no);
void listContacts(PhoneBook *pb);
void clearAllContacts(PhoneBook *pb);
void delAllContacts(PhoneBook *pb);
Contact *getContact(PhoneBook *pb, char *target);
PhoneBook *insertContact(PhoneBook *pb, Contact *c, size_t pos);

// Init
PhoneBook *createPhoneBook()
{
    PhoneBook *phone_book = (PhoneBook *)malloc(sizeof(PhoneBook));

    if (!phone_book)
        return NULL;

    phone_book->head = phone_book->tail = NULL;
    phone_book->size = 0;
    return phone_book;
}

Contact *createContact(const char *name, const char *phone_no)
{
    Contact *contact = (Contact *)malloc(sizeof(Contact));

    if (!contact)
        return NULL;
    strcpy(contact->name, name);
    strcpy(contact->phone_no, phone_no);
    contact->name[sizeof(contact->name) - 1] = '\0';
    contact->phone_no[sizeof(contact->phone_no) - 1] = '\0';
    contact->next = NULL;

    return contact;
}

int compareStr(const char *pb_name, const char *new_name)
{
    while (*pb_name && *pb_name == *new_name)
    {
        pb_name++;
        new_name++;
    }
    return (*(unsigned char *)pb_name - *(unsigned char *)new_name);
}

PhoneBook *addContact(PhoneBook *pb, const char *name, const char *phone_no)
{
    if (!pb)
    {
        pb = createPhoneBook();
        if (!pb) return NULL;
    }
    Contact *new_contact = createContact(name, phone_no);
    if (!new_contact) {
        free(pb);
        return NULL;
    }

    if (!pb->head)
    {
        pb->head = pb->tail = new_contact;
        pb->size++;
        return (pb);
    }
    Contact *tmp = pb->head;
    Contact *prev = NULL;
    while (tmp != NULL && compareStr(tmp->name, new_contact->name) < 0)
    {
        prev = tmp;
        tmp = tmp->next;
    }

    if (!prev)
    {
        new_contact->next = pb->head;
        pb->head = new_contact;
    } else {
        prev->next = new_contact;
        new_contact->next = tmp;
        if (tmp == NULL)
            pb->tail = new_contact;
    }
    pb->size++;
    return pb;
}

PhoneBook *prependContact(PhoneBook *pb, const char *name, const char *phone_no)
{
    if (!pb)
    {
        pb = createPhoneBook();
        if (!pb)
            return NULL;
    }

    Contact *new_contact = createContact(name, phone_no);
    if (!new_contact)
        return NULL;

    if (!pb->head)
    {
        pb->head = pb->tail = new_contact;
    }
    else
    {
        new_contact->next = pb->head;
        pb->head = new_contact;
    }
    pb->size++;
    printf("%s's contact added!\n", new_contact->name);
    return pb;
}

PhoneBook *appendContact(PhoneBook *pb, const char *name, const char *phone_no)
{
    if (!pb)
    {
        pb = createPhoneBook();
        if (!pb)
            return NULL;
    }

    Contact *new_contact = createContact(name, phone_no);
    if (!new_contact)
        return NULL;

    if (!pb->head)
    {
        pb->head = pb->tail = new_contact;
    }
    else
    {
        pb->tail->next = new_contact;
        pb->tail = new_contact;
    }

    pb->size++;
    printf("%s's contact added!\n", new_contact->name);
    return pb;
}

void listContacts(PhoneBook *pb)
{
    if (!pb || !pb->head)
    {
        printf("No contacts found.\n");
        return;
    }

    int i = 1;
    Contact *contact = pb->head;
    while (contact)
    {
        printf("[%d] %s ->  %s\n", i, contact->name, contact->phone_no);
        contact = contact->next;
        i++;
    }
}

void clearAllContacts(PhoneBook *pb)
{
    if (pb && pb->head)
    {

        Contact *tmp = pb->head;
        while (tmp)
        {
            Contact *mem = tmp->next;
            free(tmp);
            tmp = mem;
        }
        pb->head = pb->tail = 0;
        pb->size = 0;
        printf("Contacts deleted!\n");
        return;
    }
    printf("Contact list is empty\n");
}

void delAllContacts(PhoneBook *pb)
{
    if (!pb)
    {
        printf("PhoneBook not found\n");
        return;
    }
    clearAllContacts(pb);
    free(pb);
    printf("PhoneBook app deleted!\n");
}

Contact *getContact(PhoneBook *pb, char *target)
{
    Contact *c = pb->head;
    size_t i = 1;

    while (c)
    {
        if (strstr(c->phone_no, target) || strstr(c->name, target))
        {
            printf("Target found!\n");
            printf("[%ld] %s  %s\n", i, c->name, c->phone_no);
            return (c);
        }
        c = c->next;
        i++;
    }
    printf("Target not found!\n");
    return NULL;
}

void searchContacts(PhoneBook *pb, char *filterVal)
{
    if (!pb || !pb->head)
    {
        printf("No match found.\n");
        return;
    }

    size_t i = 1;
    Contact *c = pb->head;
    while (c)
    {
        if (strstr(c->phone_no, filterVal) || strstr(c->name, filterVal))
        {
            printf("[%ld] %s  %s\n", i, c->name, c->phone_no);
        }
        c = c->next;
        i++;
    }
}

PhoneBook *insertContact(PhoneBook *pb, Contact *c, size_t pos)
{
    if (!pb)
        return NULL;
    if (pos >= pb->size)
    {
        appendContact(pb, c->name, c->phone_no);
        return pb;
    }
    if (pos == 0)
    {
        prependContact(pb, c->name, c->phone_no);
        return pb;
    }

    Contact *tmp = pb->head;
    Contact *prev = NULL;

    size_t i = 0;

    while (tmp)
    {
        if (i == pos)
        {
            printf("Here\n");
            break;
        }
        prev = tmp;
        tmp = tmp->next;
        i++;
    }
    prev->next = c;
    c->next = tmp;
    pb->size++;
    return pb;
}

PhoneBook *delOneContact(PhoneBook *pb, size_t pos)
{
    if (!pb)
        return NULL;
    if (pos >= pb->size)
    {
        printf("Out of range\n");
        return pb;
    }

    if (pos == 0)
    {
        Contact *cache = pb->head;
        pb->head = pb->head->next;
        free(cache);
        pb->size--;
        printf("Contact deleted\n");
        return pb;
    }

    Contact *tmp = pb->head;
    Contact *prev = NULL;

    size_t i = 0;

    while (tmp)
    {
        if (i == pos)
            break;

        prev = tmp;
        tmp = tmp->next;
        i++;
    }
    Contact *cache = tmp;
    prev->next = tmp->next;
    free(cache);
    pb->size--;
    printf("Contact deleted\n");
    return pb;
}

int main(void)
{
    PhoneBook *pb = createPhoneBook();
    if (!pb)
        return -1;

    addContact(pb, "John Doe", "1234567890");
    addContact(pb, "Kane Smith", "0987654321");
    addContact(pb, "Plicia Keys", "5555555555");
    addContact(pb, "Alice Brown", "8888888888");
    addContact(pb, "Alice Wonderland", "9999999999");
    // getContact(pb, "Alice");
    // Contact *contact = createContact("Peter Thiel", "777777777777");
    // insertContact(
    //     pb,
    //     contact,
    //     pb->size + 1);
    // searchContacts(pb, "J");
    // clearAllContacts(pb);
    listContacts(pb);
    printf("\n\n");
    // delOneContact(pb, 2);
    // listContacts(pb);
    // free(contact);
    delAllContacts(pb);
    return (0);
}
