#include <iostream>
#include <string>
#include <unordered_map>
#include <algorithm>
#include <cctype>

std::string toLower(const std::string &str) {
    std::string lowerCase = str;
    std::transform(
        lowerCase.begin(),
        lowerCase.end(),
        lowerCase.begin(),
        [](unsigned char c) {
            return tolower(c);
        }
    );
    return lowerCase;
}

class PhoneBook {
private:
    std::unordered_map<std::string, std::string> contacts;

public:
    void addContact(const std::string& name, const std::string& phone_no) {
        contacts[name] = phone_no;
        std::cout << name << "'s contact added!\n";
    }

    void listContacts() const {
        if (contacts.empty()) {
            std::cout << "No contacts found.\n";
            return;
        }

        int i = 1;
        for (const auto& contact : contacts) {
            std::cout << "[" << i << "] " << contact.first << " -> " << contact.second << "\n";
            i++;
        }
    }

    void getContact(const std::string& target) const {
        auto it = contacts.find(target);
        if (it != contacts.end()) {
            std::cout << "Target found!\n";
            std::cout << it->first << " -> " << it->second << "\n";
        } else {
            std::cout << "Target not found!\n";
        }
    }

    void searchContacts(const std::string& filterVal) const {
        bool found = false;
        int i = 1;
        for (const auto& contact : contacts) {
            if (contact.first.find(filterVal) != std::string::npos || contact.second.find(filterVal) != std::string::npos) {
                std::cout << "[" << i << "] " << contact.first << " -> " << contact.second << "\n";
                found = true;
            }
            i++;
        }
        if (!found) {
            std::cout << "No match found.\n";
        }
    }

    void delContact(const std::string& name) {
        auto it = contacts.find(name);
        if (it != contacts.end()) {
            contacts.erase(it);
            std::cout << name << "'s contact deleted!\n";
        } else {
            std::cout << "Contact not found.\n";
        }
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

