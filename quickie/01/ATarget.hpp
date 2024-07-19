#pragma once

#include <iostream>
#include "ASpell.hpp"

class ASpell;

class ATarget {
private:

protected:
    std::string type;

public:
    ATarget(const std::string &type_);
    ATarget(const ATarget &src);
    ATarget &operator=(const ATarget &src);
    virtual ~ATarget();


    const std::string &getType(void) const;

    void setType(const std::string &type_);

    void getHitBySpell(const ASpell &spell) const;

    virtual ATarget *clone(void) const = 0;
};