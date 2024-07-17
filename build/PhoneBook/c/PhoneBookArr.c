#include <string.h>
#include <stdio.h>
#include <stdlib.h>

#define MIN_SIZE 3

typedef struct Contact
{
    char name[100];
    char phone_no[20];
} Contact;

typedef struct
{
    Contact *contacts;
    size_t capacity;
    size_t size;

} PhoneBook;

PhoneBook *createPhoneBook()
{
    PhoneBook *phone_book = (PhoneBook *)malloc(sizeof(PhoneBook));

    if (!phone_book)
        return NULL;
    phone_book->contacts = (Contact *)malloc(sizeof(Contact) * MIN_SIZE);
    if (!phone_book->contacts)
    {
        free(phone_book);
        return NULL;
    }
    phone_book->size = 0;
    phone_book->capacity = MIN_SIZE;
    return phone_book;
}

Contact createContact(const char *name, const char *phone_no)
{
    Contact contact;

    strcpy(contact.name, name);
    strcpy(contact.phone_no, phone_no);
    contact.name[sizeof(contact.name) - 1] = '\0';
    contact.phone_no[sizeof(contact.phone_no) - 1] = '\0';

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

PhoneBook *resizePhoneBook(PhoneBook *pb)
{
    size_t newCapacity = pb->capacity * 2;
    Contact *newList = realloc(pb->contacts, sizeof(Contact) * newCapacity);
    if (!newList)
        return NULL;
    pb->contacts = newList;
    pb->capacity = newCapacity;
    printf("Your memory has been increased!\n");
    return pb;
}

PhoneBook *addContact(PhoneBook *pb, const char *name, const char *phone_no)
{
    if (!pb)
    {
        pb = createPhoneBook();
        if (!pb)
            return NULL;
    }
    Contact new_contact = createContact(name, phone_no);

    if (pb->size == 0)
    {
        pb->contacts[0] = new_contact;
        pb->size++;
        printf("%s's Contact Added\n", new_contact.name);
        return pb;
    }
    if (pb->size >= pb->capacity)
    {
        resizePhoneBook(pb);
    }
    size_t i = 0;

    while (i < pb->size && compareStr(pb->contacts[i].name, new_contact.name) < 0)
    {
        i++;
    }

    memmove(&pb->contacts[i + 1], &pb->contacts[i], sizeof(Contact) * (pb->size - i));
    pb->contacts[i] = new_contact;
    pb->size++;
    printf("%s's Contact Added\n", new_contact.name);
    return pb;
}

void listContacts(PhoneBook *pb)
{
    size_t i = 0;
    while (i < pb->size)
    {
        printf("[%ld] %s - %s\n", i + 1, pb->contacts[i].name, pb->contacts[i].phone_no);
        i++;
    }
}

Contact *getContact(PhoneBook *pb, char *target)
{

    size_t i = 1;

    while (i < pb->size)
    {
        if (strstr(pb->contacts[i].phone_no, target) || strstr(pb->contacts[i].name, target))
        {
            printf("Target found!\n");
            return (&pb->contacts[i]);
        }
        i++;
    }
    printf("Target not found!\n");
    return NULL;
}


PhoneBook *deleteOneContact(PhoneBook *pb, const char *target)
{
    if (!pb)
        return NULL;

    size_t i = 0;

    while (i < pb->size && (strcmp(pb->contacts[i].name, target) || strcmp(pb->contacts[i].phone_no, target)))
    {
        i++;
    }

    memmove(&pb->contacts[i], &pb->contacts[i + 1], sizeof(Contact) * (pb->size - i));

    pb->size--;
    return pb;
}

void deleteContacts(PhoneBook *pb)
{
    if (pb)
    {
        if (pb->contacts)
            free(pb->contacts);
        printf("Contacts Deleted\n");
        return;
    }
    printf("No PhoneBook Found!\n");
}

void deletePB(PhoneBook *pb)
{
    if (pb)
    {
        deleteContacts(pb);
        free(pb);
        printf("PhoneBook Deleted\n");
        return;
    }
    printf("No PhoneBook Found!\n");
}

int main(void)
{
    PhoneBook *pb = createPhoneBook();

    addContact(pb, "John Doe", "1234567890");
    addContact(pb, "Kane Smith", "0987654321");
    addContact(pb, "Plicia Keys", "5555555555");
    addContact(pb, "Alice Brown", "8888888888");
    addContact(pb, "Alice Wonderland", "9999999999");
    deleteOneContact(pb, "Plicia Keys");
    Contact *target = getContact(pb, "Kane Smith");
    printf("* %s - %s *\n", target->name, target->phone_no);

    listContacts(pb);
    deletePB(pb);
    return (0);
}
