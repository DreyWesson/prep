#pragma once

#include <iostream>
#include <map>
#include "ASpell.hpp"
#include "ATarget.hpp"
#include "SpellBook.hpp"

class ASpell;
class ATarget;

class Warlock {
private:
    std::string name;
    std::string title;
    // std::map<std::string, ASpell *>spellList;

    Warlock();
    Warlock(const Warlock &src);
    Warlock &operator=(const Warlock &src);
    SpellBook spellBook;

protected:

public:
    Warlock(const std::string &name_, const std::string &title_);
    ~Warlock();

    const std::string &getName(void) const;
    const std::string &getTitle(void) const;

    void setName(const std::string &name_);
    void setTitle(const std::string &name_);

    void introduce() const;
    void learnSpell(ASpell *spell);
    void forgetSpell(const std::string &spellName);
    void launchSpell(std::string spellName, ATarget &target);
};