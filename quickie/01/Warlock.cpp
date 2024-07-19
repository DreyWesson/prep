#include "Warlock.hpp"
#include "ASpell.hpp"
#include "ATarget.hpp"

Warlock::Warlock(const std::string &name_, const std::string &title_) : name(name_), title(title_) {
    std::cout << name << " This looks like another boring day." << std::endl;
}

Warlock::~Warlock() {
    std::map<std::string, ASpell *>::iterator it = spellList.begin();
    while (it != spellList.end()) {
        delete it->second;
        it++;
    }
    spellList.clear();
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

void Warlock::learnSpell(ASpell *spell) {
    if (spell) {
        std::map<std::string, ASpell *>::iterator it = spellList.find(spell->getName());
        if (it != spellList.end()) {
            delete it->second;
        }
        spellList[spell->getName()] = spell->clone();
    }
}

void Warlock::forgetSpell(const std::string &spellName) {
    if (!spellName.empty()) {
        std::map<std::string, ASpell *>::iterator it = spellList.find(spellName);
        if (it != spellList.end()) {
            delete it->second;
            spellList.erase(it);
        }
    }
}

void Warlock::launchSpell(std::string spellName, ATarget &target) {
    if (!spellName.empty()) {
        std::map<std::string, ASpell *>::iterator it = spellList.find(spellName);
        if (it != spellList.end()) {
            it->second->launch(target);
        }
    }
}

