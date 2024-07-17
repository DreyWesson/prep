#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

class Contact {
public:
    std::string name;
    std::string phone_no;

    Contact(const std::string& name, const std::string& phone_no)
        : name(name), phone_no(phone_no) {}
};

class PhoneBook {
private:
    std::vector<Contact> contacts;

public:
    void addContact(const std::string& name, const std::string& phone_no) {
        Contact new_contact(name, phone_no);
        
        std::vector<Contact>::iterator it = contacts.begin();
        while (it != contacts.end() && it->name < name) {
            ++it;
        }

        contacts.insert(it, new_contact);
        std::cout << name << "'s contact added!\n";
    }

    void listContacts() const {
        if (contacts.empty()) {
            std::cout << "No contacts found.\n";
            return;
        }

        int i = 1;
        for (std::vector<Contact>::const_iterator it = contacts.begin(); it != contacts.end(); ++it) {
            std::cout << "[" << i << "] " << it->name << " -> " << it->phone_no << "\n";
            ++i;
        }
    }

    void getContact(const std::string& target) const {
        for (std::vector<Contact>::const_iterator it = contacts.begin(); it != contacts.end(); ++it) {
            if (it->name == target) {
                std::cout << "Target found!\n";
                std::cout << it->name << " -> " << it->phone_no << "\n";
                return;
            }
        }
        std::cout << "Target not found.\n";
    }

    void searchContacts(const std::string& filterVal) const {
        bool found = false;
        int i = 1;
        for (std::vector<Contact>::const_iterator it = contacts.begin(); it != contacts.end(); ++it) {
            if (it->name.find(filterVal) != std::string::npos || it->phone_no.find(filterVal) != std::string::npos) {
                std::cout << "[" << i << "] " << it->name << " -> " << it->phone_no << "\n";
                found = true;
            }
            ++i;
        }
        if (!found) {
            std::cout << "No match found.\n";
        }
    }

    void delContact(const std::string& name) {
        for (std::vector<Contact>::iterator it = contacts.begin(); it != contacts.end(); ++it) {
            if (it->name == name) {
                contacts.erase(it);
                std::cout << name << "'s contact deleted!\n";
                return;
            }
        }
        std::cout << "Contact not found.\n";
    }

    void clearAllContacts() {
        contacts.clear();
        std::cout << "All contacts deleted!\n";
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
    std::cout << "\n";

    pb.getContact("Alice Brown");
    std::cout << "\n";

    pb.searchContacts("Alice");
    std::cout << "\n";

    pb.delContact("Alice Brown");
    pb.listContacts();
    std::cout << "\n";

    pb.clearAllContacts();
    pb.listContacts();

    return 0;
}
