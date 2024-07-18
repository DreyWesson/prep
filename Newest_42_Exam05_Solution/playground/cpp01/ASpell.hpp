#pragma once

#include <iostream>
#include "ATarget.hpp"

class ATarget;

class ASpell
{
private:
    ASpell(void);

protected:
    std::string name;
    std::string effects;

public:
    ASpell(const std::string &name, const std::string &effects);
    ASpell(const ASpell &src);
    ASpell &operator=(const ASpell &src);
    virtual ~ASpell();


    void setName(const std::string &name_);
    void setEffects(const std::string &title_);

    const std::string &getName(void) const;
    const std::string &getEffects(void) const;

    void launch(const ATarget &target) const;

    virtual ASpell *clone() const = 0;
};
