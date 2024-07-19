#include "Warlock.hpp"

Warlock::Warlock(const std::string &name_, const std::string &title_) : name(name_), title(title_) {
    std::cout << name << " This looks like another boring day." << std::endl;
}

Warlock::~Warlock() {
    std::cout << name << " My job here is done!" << std::endl;
}

const std::string &Warlock::getName(void) const {
    return name;
}

const std::string &Warlock::getTitle(void) const {
    return title;
}

void Warlock::setName(const std::string &name_) {
    name = name_;
}

void Warlock::setTitle(const std::string &title_) {
    title = title_;
}

void Warlock::introduce() const {
    std::cout << getName() << ": I am " << getName() << ", "<< getTitle() << "!"<< std::endl;
}
