#pragma once

#include "ATarget.hpp"

class Dummy : public ATarget {
private:

protected:

public:
    Dummy();
    ~Dummy();
    ATarget *clone() const;
};
