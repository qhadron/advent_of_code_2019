#include <iostream>
#include <vector>
#include <fstream>
#include <string>
#include <utility>
#include <algorithm>
#include <limits>
#include <functional>

/*
For this question, the brute force solution (by checking every coordinate) is
very inefficient. Instead, notice that there are 2 possibilities for intersections.

Either vertical lines intersect with horizontal lines
or lines of the same direction intersect (unlikely, due to the nature of the question)

Comparing each vertical line with each horizontal line has a runtime of O(n^2),
but we can do better by sorting the inputs.

Sort the vertical lines by x coordinate.
Sort the horizontal lines by first x coordinate.

There are 2 possible cases for two lines with respect to
their x coordinate:

Case 1        Case 2     Case 2'
|               |             |
| -----      ---+---    ----- |
|               |             |

Note: this is only about the x coordinate, the lines in case 2 may not intersect.

Case 1: vertical.x <  horizontal.x1
Case 2: vertical.x >= horizontal.x1
Case 2': no intersection

If we are in case 1, we can simply consider the next vertical line.
In case 2, we have to check the horizontal line with vertical lines
until vertical.x > horizontal.x2
then we can check the next hline.
Eventually we wil reach case 1 again.

In the worst case, the runtime is O(n^2).
On average it should be close to O(n log n)

*/

/*
For part 2, we now store the number of steps it took to get to
the start of each segment, and also which point is the beginning of each segment
*/

using namespace std;

// stores lines
// always assume y1 < y2
// always assume x1 < x2
struct Line {
	int x1, x2, y1, y2;
	int steps;
	int start; // 1 if y1 is start, 2 if y2 is start
	// this is not needed
	// char type; // v if vertical, h if horizontal
};

// answers for part 1 and part 2
int part1 = numeric_limits<int>::max();
int part2 = numeric_limits<int>::max();


// manhattan distance
// v is vertical line, y is horizontal line
inline int manhattan(const Line& v, const Line& h) {
	int x = v.x1, y = h.y1;
	return (x > 0 ? x : -x) + (y > 0 ? y : -y);
}


// step distance
// v is vertical line, y is horizontal line
inline int step_dist(const Line& v, const Line& h) {
	// intersection point
	int x = v.x1, y = h.y1;
	int d = 0; // distance to get here
	// distance of vertical path
	d += v.steps;
	if (v.start == 1)
		d += y - v.y1;
	else
		d += v.y2 - y;
	// distance of horizontal path
	d += h.steps;
	if (h.start == 1)
		d += x - h.x1;
	else
		d += h.x2 - x;
	return d;
}

pair<vector<Line>, vector<Line>> parseCircuit(const string& line) {
	// output vectors
	vector<Line> v;
	vector<Line> h;
	// assume we start from the origin
	int x = 0, y = 0;

	// keep track of the number of steps for part 2
	int steps = 0;

	for (auto it = line.begin(); it != line.end();) {
		// first character is direction
		char direction = *it;
		++it;

		// read an integer (until we find a comma)
		int value = 0;
		for (; it != line.end() && (*it != ','); ++it) {
			value = (*it - '0') + 10 * value;
		}

		// Create lines based on direction
		switch (direction) {
			// horizontal lines
			case 'R':
				h.push_back({x, x + value, y, y, steps, 1});
				x += value;
				break;
			case 'L':
				h.push_back({x - value, x, y, y, steps, 2});
				x -= value;
				break;

			// vertical lines
			case 'U':
				v.push_back({x, x, y, y + value, steps, 1});
				y += value;
				break;
			case 'D':
				v.push_back({x, x, y - value, y, steps, 2});
				y -= value;
				break;
		}

		steps += value;

		if (it == line.end())
			break;
		else
			++it;
	}
	return make_pair(move(v), move(h));
}

// returns true if x is in the interval [a,b]
constexpr bool between(const int a, const int x, const int b) {
	return a <= x && x <= b;
}

// V is vertical lines from one circuit
// H is horizontal lines from the other circuit
// returns the minimum distance where the lines intersect
void checkIntersect( const vector<Line> &V, const vector<Line> &H) {

	// iterators for the vectors
	auto v = V.begin();
	auto h = H.begin();

	while (v != V.end() && h != H.end()) {
		if (v->x1 < h->x1) {
			// case 1
			// move on to the next vertical line
			++v;
		} else {
			// case 2

			// for each h line here, we need to check
			// every v line until v.x > h.x2

			for (auto _v = v; _v != V.end() && _v->x1 <= h->x2; ++_v) {
				// check for intersection
				if (
						between(_v->y1, h->y1, _v->y2)
					&&  between(h->x1, _v->x1, h->x2)
				   ) {
					// intersection point is at i->x, i->y
					cout << "Intersection at ("
						<< _v->x1
						<< ","
						<< h->y1
						<< ")" << endl;

					// intersection at (0,0) doesn't count
					if (!(_v->x1 == 0 && h->y1 == 0)) {
						// update min distances
						part1 = min(part1, manhattan(*_v, *h));
						part2 = min(part2, step_dist(*_v, *h));
					}
				}
			}

			// move on to the next horizontal line
			++h;
		}
	}
}

bool cmpX(const Line& a, const Line& b) {
		return a.x1 < b.x1;
}
bool cmpY(const Line& a, const Line& b) {
		return a.y1 < b.y1;
}

int main () {
	ifstream input("day_3.in");

	while (true) {
		part1 = numeric_limits<int>::max();
		part2 = numeric_limits<int>::max();

		cout << "===================" << endl;
		// ignore lines starting with #
		while (input.peek() == '#')
			input.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
		// read inputs
		string curcuit_1;
		string curcuit_2;
		// break if read fails
		if (!getline(input, curcuit_1))
			break;
		if (!getline(input, curcuit_2))
			break;
		cout << "Input" << endl;
		cout << '`' << curcuit_1 << '`' << endl;
		cout << '`' << curcuit_2 << '`' << endl;

		// parse into line segments
		auto A = parseCircuit(curcuit_1);
		cout << "Found " << A.first.size() + A.second.size()
			<< " line segments for A" << endl;
		auto B = parseCircuit(curcuit_2);
		cout << "Found " << B.first.size() + B.second.size()
			<< " line segments for B" << endl;

		// sort the lines
		sort(A.first.begin(), A.first.end(), cmpX);
		sort(A.second.begin(), A.second.end(),cmpX);
		sort(B.first.begin(), B.first.end(), cmpX);
		sort(B.second.begin(), B.second.end(),cmpX);

		cout << "Looking at A's vertical lines..." << endl;
		// check A's vertical lines with B's horizontal lines
		checkIntersect(A.first, B.second);

		cout << "Looking at B's vertical lines..." << endl;
		// check B's vertical lines with A's horizontal lines
		checkIntersect(B.first, A.second);

		cout << "part1: " << part1 << endl;
		cout << "part2: " << part2 << endl;
	}
}
