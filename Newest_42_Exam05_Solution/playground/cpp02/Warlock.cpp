#include "Warlock.hpp"

Warlock::Warlock(const std::string &name_, const std::string &title_) : name(name_), title(title_)
{
    std::cout << name << ": This looks like another boring day." << std::endl;
}

Warlock::~Warlock()
{
    std::map<std::string, ASpell *>::iterator it = spellBook.begin();
    while (it != spellBook.end())
    {
        delete it->second;
        it++;
    }
    spellBook.clear();
    std::cout << name << ": My job here is done!" << std::endl;
}

void Warlock::setName(const std::string &name_)
{
    name = name_;
}

void Warlock::setTitle(const std::string &title_)
{
    title = title_;
}

const std::string &Warlock::getName(void) const
{
    return name;
}

const std::string &Warlock::getTitle(void) const
{
    return title;
}

void Warlock::introduce() const
{
    std::cout << name << ": I am " << getName() << ", " << getTitle() << std::endl;
}

void Warlock::learnSpell(ASpell *spell)
{

        std::map<std::string, ASpell *>::iterator it = spellBook.find(spell->getName());
        if (it != spellBook.end())
        {
            delete it->second;
        }

        spellBook[spell->getName()] = spell->clone();
}

void Warlock::forgetSpell(const std::string &spellName)
{

    std::map<std::string, ASpell *>::iterator it = spellBook.find(spellName);
    if (it != spellBook.end())
    {
        delete it->second;
        spellBook.erase(it);
    }
}

void Warlock::launchSpell(const std::string &spellName, ATarget &target)
{
    if (!spellName.empty())
    {
        std::map<std::string, ASpell *>::iterator it = spellBook.find(spellName);
        if (it != spellBook.end())
            it->second->launch(target);
    }
}

