#include <iostream>
#include <string>
#include <cstdint>
#include <fstream>



using namespace std;
using Integer = uint_fast32_t;

int main() {
	ifstream input("day_4.in");

	string low, high;
	getline(input, low, '-');
	getline(input, high);

	/*
	 * Part 1:
	 * do the checks directly, but notice that
	 * we can skip some strings because they won't meet the criteria
	 *
	 * Example:
	 * 110220 has decreasing sequence, so we can skip to 111111
	 * 123456 has no repeated characters, so we can skip to 123466
	 */
	int part1 = 0;

	int checked = 0;
	for (string l = low; l <= high;) {
		checked += 1;
		bool same = false; // same rule
		bool ordered  = true; // order rule

		string next = l;
		for (size_t i = 1; i < l.size(); ++i) {
			if (l[i-1] > l[i]) {
				// found a decrease
				ordered = false;
				// advance low until the rest of the digits satisfy the order rule
				for (size_t j = i; j < l.size(); ++j)
					next[j] = l[i-1];
				break;
			}
			if (l[i-1] == l[i])
				same = true;
		}
		if (same && ordered)
			part1 += 1;

		if (!same && ordered) {
			// no same characters
			// advance next so that the last 2 of low the same
			next[next.size() - 2] = next[next.size() - 1];
		}

		if (next == l) {
			// advance manually
			next = to_string(atoi(l.c_str()) + 1);
		}
		l = move(next);
	}
	cout << "Part 1: " << part1 << endl;
	cout << "Checked " << checked << "/"
		<< atoi(high.c_str()) - atoi(low.c_str()) + 1<< " numbers" << endl;

	/*
	 * Part 2:
	 * we can still skip the same values in part 1
	 * and now we have some extra skips, but they require keeping track of
	 * the location of the repeats, so the skips are not implemented
	 *
	 * From part 1:
	 * 110220 has decreasing sequence, so we can skip to 111111
	 * 123456 has no repeated characters, so we can skip to 123466
	 *
	 * Part 2 skips:
	 * 111234 has no repeat of length 2, so can skip to 111244
	 * 123444 has no repeat of length 2, so can skip to 123445
	 * 124444 has no repeat of length 2, so can skip to 124455
	 * 111111 has no repeat of length 2, so can skip to 111122
	 */

	int part2 = 0;
	checked = 0;
	for (string l = low; l <= high;) {
		checked += 1;

		int repeated_length = 1;
		bool ordered  = true; // order rule
		bool same = false; // part 2 repeating rule

		bool repeating = false; // used for skipping no repeated characters

		string next = l;
		for (size_t i = 1; i < l.size(); ++i) {
			if (l[i-1] > l[i]) {
				// found a decrease
				ordered = false;
				// advance until the rest of the digits satisfy the order rule
				for (size_t j = i; j < l.size(); ++j)
					next[j] = l[i-1];
				break;
			}
			if (l[i] == l[i-1]) {
				repeated_length += 1;
				repeating = true;
			} else {
				// check if we had a run of 2 repeated characters
				if (repeated_length == 2)
					same = true;
				// reset the counter
				repeated_length = 1;
			}
		}

		if (repeated_length == 2)
			same = true;

		if (same && ordered) {
			part2 += 1;
		}

		if (!repeating && ordered) {
			// no same characters
			// advance next so that the last 2 of low the same
			next[next.size() - 2] = next[next.size() - 1];
		}

		if (next == l) {
			// advance manually
			next = to_string(atoi(l.c_str()) + 1);
		}
		l = move(next);
	}
	cout << "Part 2: " << part2 << endl;
	cout << "Checked " << checked << "/"
		<< atoi(high.c_str()) - atoi(low.c_str()) + 1 << " numbers" << endl;
}
