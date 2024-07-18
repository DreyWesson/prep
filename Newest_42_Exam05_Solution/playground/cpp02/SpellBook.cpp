#include "SpellBook.hpp"
#include "ATarget.hpp"

// SpellBook::SpellBook(const SpellBook &src) : name(src.name), effects(src.effects) {
// }

// SpellBook &SpellBook::operator=(const SpellBook &src) {
//     if (this != &src) {
//         this->name = src.name;
//         this->effects = src.effects;
//     }
//     return *this;
// }

SpellBook::~SpellBook()
{
    std::map<std::string, ASpell *>::iterator it = spellBook.begin();
    while (it != spellBook.end())
    {
        delete it->second;
        it++;
    }
    spellBook.clear();
}

void SpellBook::learnSpell(ASpell *spell)
{
    if (spell)
    {
        std::map<std::string, ASpell *>::iterator it = spellBook.find(spell->getName());
        if (it != spellBook.end())
        {
            delete it->second;
        }

        spellBook[spell->getName()] = spell->clone();
    }
}

void SpellBook::forgetSpell(const std::string &spellName)
{
    if (!spellName.empty())
    {
        std::map<std::string, ASpell *>::iterator it = spellBook.find(spellName);
        if (it != spellBook.end())
        {
            delete it->second;
            spellBook.erase(it);
        }
    }
}

ASpell *SpellBook::createSpell(std::string const &spellName)
{

    std::map<std::string, ASpell *>::iterator it = spellBook.find(spellName);
    if (it != spellBook.end())
    {
        return it->second->clone();
    }

    return NULL;
}
