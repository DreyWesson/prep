#pragma once

#include <iostream>
#include "ATarget.hpp"

class ATarget;

class ASpell {
private:

protected:
    std::string name;
    std::string effects;

public:
    ASpell(const std::string &name_, const std::string &effects_);
    ASpell(const ASpell &src);
    ASpell &operator=(const ASpell &src);
    virtual ~ASpell();


    const std::string &getName(void) const;
    const std::string &getEffects(void) const;

    void setName(const std::string &name_);
    void setEffects(const std::string &effects_);

    void launch(const ATarget &target) const;

    virtual ASpell *clone(void) const = 0;
};