#pragma once

#include "ATarget.hpp"

class BrickWall : public ATarget {
private:

protected:

public:
    BrickWall();
    ~BrickWall();
    ATarget *clone() const;
};
