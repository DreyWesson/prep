#include "SpellBook.hpp"
#include "ASpell.hpp"
#include "ATarget.hpp"

SpellBook::SpellBook() {}

SpellBook::~SpellBook() {
    std::map<std::string, ASpell *>::iterator it = spellList.begin();
    while (it != spellList.end()) {
        delete it->second;
        it++;
    }
    spellList.clear();
}

void SpellBook::learnSpell(ASpell *spell) {
    if (spell) {
        std::map<std::string, ASpell *>::iterator it = spellList.find(spell->getName());
        if (it != spellList.end()) {
            delete it->second;
        }
        spellList[spell->getName()] = spell->clone();
    }
}

void SpellBook::forgetSpell(const std::string &spellName) {
    if (!spellName.empty()) {
        std::map<std::string, ASpell *>::iterator it = spellList.find(spellName);
        if (it != spellList.end()) {
            delete it->second;
            spellList.erase(it);
        }
    }
}

ASpell* SpellBook::createSpell(std::string const &spellName) {
        std::map<std::string, ASpell *>::iterator it = spellList.find(spellName);
        if (it != spellList.end()) {
            return it->second->clone();
        } 
        return NULL;
}


