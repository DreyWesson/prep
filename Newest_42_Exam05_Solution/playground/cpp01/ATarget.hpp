#pragma once

#include <iostream>
#include "ASpell.hpp"

class ASpell;

class ATarget
{
private:
    ATarget(void);

protected:
    std::string type;


public:
    ATarget(const std::string &type_);
    ATarget(const ATarget &src);
    ATarget &operator=(const ATarget &src);
    virtual ~ATarget();


    void setType(const std::string &type_);

    const std::string &getType(void) const;

    virtual ATarget *clone() const = 0;

    void getHitBySpell(const ASpell &spell) const;
};
