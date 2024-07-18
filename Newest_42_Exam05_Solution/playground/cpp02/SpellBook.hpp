#pragma once

#include <iostream>
#include <map>
#include "ASpell.hpp"


class ASpell;

class SpellBook
{
private:
    SpellBook(const std::string &name, const std::string &effects);
    SpellBook(const SpellBook &src);
    std::map<std::string, ASpell *>spellBook;

protected:
    std::string name;
    std::string effects;

public:
    SpellBook(void);
    SpellBook &operator=(const SpellBook &src);
    virtual ~SpellBook();


    void learnSpell(ASpell *spell);
    void forgetSpell(std::string const &);
    ASpell* createSpell(std::string const &);


    virtual SpellBook *clone() const = 0;
};
