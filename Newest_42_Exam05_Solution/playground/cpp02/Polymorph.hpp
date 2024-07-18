#pragma once

#include "ASpell.hpp"

class Polymorph : public ASpell {
private:

protected:

public:
    Polymorph();
    ~Polymorph();
    ASpell *clone() const;
};
