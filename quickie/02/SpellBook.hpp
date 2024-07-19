#pragma once

#include <iostream>
#include <map>
#include "ASpell.hpp"
// #include "ATarget.hpp"

class ASpell;
// class ATarget;

class SpellBook {
private:

    SpellBook(const SpellBook &src);
    SpellBook &operator=(const SpellBook &src);

    std::map<std::string, ASpell *>spellList;

protected:

public:
    SpellBook();
    ~SpellBook();


    void learnSpell(ASpell *spell);
    void forgetSpell(const std::string &spellName);
    ASpell* createSpell(std::string const &spellName);
};