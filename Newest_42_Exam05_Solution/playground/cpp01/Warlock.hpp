#pragma once

#include <iostream>
#include <map>

#include "ASpell.hpp"
#include "ATarget.hpp"

class Warlock
{
private:
    std::string name;
    std::string title;
    std::map<std::string, ASpell *> spellBook;

    Warlock();
    Warlock(const Warlock &src);
    Warlock &operator=(const Warlock &src);

public:
    Warlock(const std::string &name, const std::string &title);
    ~Warlock();

    void setName(const std::string &name_);
    void setTitle(const std::string &title_);

    const std::string &getName(void) const;
    const std::string &getTitle(void) const;
    void introduce() const;

    void learnSpell(ASpell *spell);
    void forgetSpell(const std::string &spellName);
    void launchSpell(const std::string &spellName, ATarget &target);
};
