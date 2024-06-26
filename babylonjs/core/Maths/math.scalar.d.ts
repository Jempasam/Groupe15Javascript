/**
 * Scalar computation library
 */
export declare class Scalar {
    /**
     * Two pi constants convenient for computation.
     */
    static TwoPi: number;
    /**
     * Boolean : true if the absolute difference between a and b is lower than epsilon (default = 1.401298E-45)
     * @param a number
     * @param b number
     * @param epsilon (default = 1.401298E-45)
     * @returns true if the absolute difference between a and b is lower than epsilon (default = 1.401298E-45)
     */
    static WithinEpsilon: (a: number, b: number, epsilon?: number) => boolean;
    /**
     * Returns a string : the upper case translation of the number i to hexadecimal.
     * @param i number
     * @returns the upper case translation of the number i to hexadecimal.
     */
    static ToHex: (i: number) => string;
    /**
     * Returns -1 if value is negative and +1 is value is positive.
     * @param value the value
     * @returns the value itself if it's equal to zero.
     */
    static Sign(value: number): number;
    /**
     * Returns the value itself if it's between min and max.
     * Returns min if the value is lower than min.
     * Returns max if the value is greater than max.
     * @param value the value to clmap
     * @param min the min value to clamp to (default: 0)
     * @param max the max value to clamp to (default: 1)
     * @returns the clamped value
     */
    static Clamp: (value: number, min?: number, max?: number) => number;
    /**
     * the log2 of value.
     * @param value the value to compute log2 of
     * @returns the log2 of value.
     */
    static Log2(value: number): number;
    /**
     * the floor part of a log2 value.
     * @param value the value to compute log2 of
     * @returns the log2 of value.
     */
    static ILog2(value: number): number;
    /**
     * Loops the value, so that it is never larger than length and never smaller than 0.
     *
     * This is similar to the modulo operator but it works with floating point numbers.
     * For example, using 3.0 for t and 2.5 for length, the result would be 0.5.
     * With t = 5 and length = 2.5, the result would be 0.0.
     * Note, however, that the behaviour is not defined for negative numbers as it is for the modulo operator
     * @param value the value
     * @param length the length
     * @returns the looped value
     */
    static Repeat(value: number, length: number): number;
    /**
     * Normalize the value between 0.0 and 1.0 using min and max values
     * @param value value to normalize
     * @param min max to normalize between
     * @param max min to normalize between
     * @returns the normalized value
     */
    static Normalize(value: number, min: number, max: number): number;
    /**
     * Denormalize the value from 0.0 and 1.0 using min and max values
     * @param normalized value to denormalize
     * @param min max to denormalize between
     * @param max min to denormalize between
     * @returns the denormalized value
     */
    static Denormalize(normalized: number, min: number, max: number): number;
    /**
     * Calculates the shortest difference between two given angles given in degrees.
     * @param current current angle in degrees
     * @param target target angle in degrees
     * @returns the delta
     */
    static DeltaAngle(current: number, target: number): number;
    /**
     * PingPongs the value t, so that it is never larger than length and never smaller than 0.
     * @param tx value
     * @param length length
     * @returns The returned value will move back and forth between 0 and length
     */
    static PingPong(tx: number, length: number): number;
    /**
     * Interpolates between min and max with smoothing at the limits.
     *
     * This function interpolates between min and max in a similar way to Lerp. However, the interpolation will gradually speed up
     * from the start and slow down toward the end. This is useful for creating natural-looking animation, fading and other transitions.
     * @param from from
     * @param to to
     * @param tx value
     * @returns the smooth stepped value
     */
    static SmoothStep(from: number, to: number, tx: number): number;
    /**
     * Moves a value current towards target.
     *
     * This is essentially the same as Mathf.Lerp but instead the function will ensure that the speed never exceeds maxDelta.
     * Negative values of maxDelta pushes the value away from target.
     * @param current current value
     * @param target target value
     * @param maxDelta max distance to move
     * @returns resulting value
     */
    static MoveTowards(current: number, target: number, maxDelta: number): number;
    /**
     * Same as MoveTowards but makes sure the values interpolate correctly when they wrap around 360 degrees.
     *
     * Variables current and target are assumed to be in degrees. For optimization reasons, negative values of maxDelta
     *  are not supported and may cause oscillation. To push current away from a target angle, add 180 to that angle instead.
     * @param current current value
     * @param target target value
     * @param maxDelta max distance to move
     * @returns resulting angle
     */
    static MoveTowardsAngle(current: number, target: number, maxDelta: number): number;
    /**
     * Creates a new scalar with values linearly interpolated of "amount" between the start scalar and the end scalar.
     * @param start start value
     * @param end target value
     * @param amount amount to lerp between
     * @returns the lerped value
     */
    static Lerp: (start: number, end: number, amount: number) => number;
    /**
     * Same as Lerp but makes sure the values interpolate correctly when they wrap around 360 degrees.
     * The parameter t is clamped to the range [0, 1]. Variables a and b are assumed to be in degrees.
     * @param start start value
     * @param end target value
     * @param amount amount to lerp between
     * @returns the lerped value
     */
    static LerpAngle(start: number, end: number, amount: number): number;
    /**
     * Calculates the linear parameter t that produces the interpolant value within the range [a, b].
     * @param a start value
     * @param b target value
     * @param value value between a and b
     * @returns the inverseLerp value
     */
    static InverseLerp(a: number, b: number, value: number): number;
    /**
     * Returns a new scalar located for "amount" (float) on the Hermite spline defined by the scalars "value1", "value3", "tangent1", "tangent2".
     * @see http://mathworld.wolfram.com/HermitePolynomial.html
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param amount defines the amount on the interpolation spline (between 0 and 1)
     * @returns hermite result
     */
    static Hermite(value1: number, tangent1: number, value2: number, tangent2: number, amount: number): number;
    /**
     * Returns a new scalar which is the 1st derivative of the Hermite spline defined by the scalars "value1", "value2", "tangent1", "tangent2".
     * @param value1 defines the first control point
     * @param tangent1 defines the first tangent
     * @param value2 defines the second control point
     * @param tangent2 defines the second tangent
     * @param time define where the derivative must be done
     * @returns 1st derivative
     */
    static Hermite1stDerivative(value1: number, tangent1: number, value2: number, tangent2: number, time: number): number;
    /**
     * Returns a random float number between and min and max values
     * @param min min value of random
     * @param max max value of random
     * @returns random value
     */
    static RandomRange: (min: number, max: number) => number;
    /**
     * This function returns percentage of a number in a given range.
     *
     * RangeToPercent(40,20,60) will return 0.5 (50%)
     * RangeToPercent(34,0,100) will return 0.34 (34%)
     * @param number to convert to percentage
     * @param min min range
     * @param max max range
     * @returns the percentage
     */
    static RangeToPercent(number: number, min: number, max: number): number;
    /**
     * This function returns number that corresponds to the percentage in a given range.
     *
     * PercentToRange(0.34,0,100) will return 34.
     * @param percent to convert to number
     * @param min min range
     * @param max max range
     * @returns the number
     */
    static PercentToRange(percent: number, min: number, max: number): number;
    /**
     * Returns the angle converted to equivalent value between -Math.PI and Math.PI radians.
     * @param angle The angle to normalize in radian.
     * @returns The converted angle.
     */
    static NormalizeRadians: (angle: number) => number;
    /**
     * Returns the highest common factor of two integers.
     * @param a first parameter
     * @param b second parameter
     * @returns HCF of a and b
     */
    static HCF(a: number, b: number): number;
}
