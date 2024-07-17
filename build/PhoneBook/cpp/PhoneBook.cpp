#include <iostream>
#include <string>

struct Contact {
    std::string name;
    std::string phone_no;
    Contact* next;

    Contact(const std::string& name, const std::string& phone_no)
        : name(name), phone_no(phone_no), next(nullptr) {}
};

class PhoneBook {
private:
    Contact* head;
    Contact* tail;
    size_t size;

public:
    PhoneBook() : head(nullptr), tail(nullptr), size(0) {}

    ~PhoneBook() {
        clearAllContacts();
    }

    void addContact(const std::string& name, const std::string& phone_no) {
        Contact* new_contact = new Contact(name, phone_no);

        if (!head) {
            head = tail = new_contact;
        } else {
            Contact* tmp = head;
            Contact* prev = nullptr;
            while (tmp && tmp->name < new_contact->name) {
                prev = tmp;
                tmp = tmp->next;
            }

            if (!prev) {
                new_contact->next = head;
                head = new_contact;
            } else {
                prev->next = new_contact;
                new_contact->next = tmp;
                if (!tmp) {
                    tail = new_contact;
                }
            }
        }
        size++;
        std::cout << name << "'s contact added!\n";
    }

    void prependContact(const std::string& name, const std::string& phone_no) {
        Contact* new_contact = new Contact(name, phone_no);

        if (!head) {
            head = tail = new_contact;
        } else {
            new_contact->next = head;
            head = new_contact;
        }
        size++;
        std::cout << name << "'s contact added!\n";
    }

    void appendContact(const std::string& name, const std::string& phone_no) {
        Contact* new_contact = new Contact(name, phone_no);

        if (!head) {
            head = tail = new_contact;
        } else {
            tail->next = new_contact;
            tail = new_contact;
        }
        size++;
        std::cout << name << "'s contact added!\n";
    }

    void listContacts() const {
        if (!head) {
            std::cout << "No contacts found.\n";
            return;
        }

        int i = 1;
        Contact* contact = head;
        while (contact) {
            std::cout << "[" << i << "] " << contact->name << " -> " << contact->phone_no << "\n";
            contact = contact->next;
            i++;
        }
    }

    void clearAllContacts() {
        Contact* tmp = head;
        while (tmp) {
            Contact* mem = tmp->next;
            delete tmp;
            tmp = mem;
        }
        head = tail = nullptr;
        size = 0;
        std::cout << "Contacts deleted!\n";
    }

    void delAllContacts() {
        clearAllContacts();
        std::cout << "PhoneBook app deleted!\n";
    }

    Contact* getContact(const std::string& target) const {
        Contact* c = head;
        size_t i = 1;

        while (c) {
            if (c->phone_no.find(target) != std::string::npos || c->name.find(target) != std::string::npos) {
                std::cout << "Target found!\n";
                std::cout << "[" << i << "] " << c->name << " " << c->phone_no << "\n";
                return c;
            }
            c = c->next;
            i++;
        }
        std::cout << "Target not found!\n";
        return nullptr;
    }

    void searchContacts(const std::string& filterVal) const {
        if (!head) {
            std::cout << "No match found.\n";
            return;
        }

        size_t i = 1;
        Contact* c = head;
        while (c) {
            if (c->phone_no.find(filterVal) != std::string::npos || c->name.find(filterVal) != std::string::npos) {
                std::cout << "[" << i << "] " << c->name << " " << c->phone_no << "\n";
            }
            c = c->next;
            i++;
        }
    }

    void insertContact(Contact* c, size_t pos) {
        if (pos >= size) {
            appendContact(c->name, c->phone_no);
            return;
        }
        if (pos == 0) {
            prependContact(c->name, c->phone_no);
            return;
        }

        Contact* tmp = head;
        Contact* prev = nullptr;
        size_t i = 0;

        while (tmp) {
            if (i == pos) {
                break;
            }
            prev = tmp;
            tmp = tmp->next;
            i++;
        }
        prev->next = c;
        c->next = tmp;
        size++;
    }

    void delOneContact(size_t pos) {
        if (pos >= size) {
            std::cout << "Out of range\n";
            return;
        }

        if (pos == 0) {
            Contact* cache = head;
            head = head->next;
            delete cache;
            size--;
            std::cout << "Contact deleted\n";
            return;
        }

        Contact* tmp = head;
        Contact* prev = nullptr;
        size_t i = 0;

        while (tmp) {
            if (i == pos) {
                break;
            }
            prev = tmp;
            tmp = tmp->next;
            i++;
        }
        Contact* cache = tmp;
        prev->next = tmp->next;
        delete cache;
        size--;
        std::cout << "Contact deleted\n";
    }
};

int main() {
    PhoneBook pb;

    pb.addContact("John Doe", "1234567890");
    pb.addContact("Kane Smith", "0987654321");
    pb.addContact("Plicia Keys", "5555555555");
    pb.addContact("Alice Brown", "8888888888");
    pb.addContact("Alice Wonderland", "9999999999");

    pb.listContacts();
    std::cout << "\n\n";

    pb.delAllContacts();
    return 0;
}
