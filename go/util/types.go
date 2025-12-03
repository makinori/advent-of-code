package util

type AnyInt interface {
	~int | ~int8 | ~int16 | ~int32 | ~int64
}

type AnyUint interface {
	~uint | ~uint8 | ~uint16 | ~uint32 | ~uint64
}

type AnyFloat interface {
	~float32 | ~float64
}
