
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./TableContent";
import { Product } from "../../content/contentScript";

interface ResultsTableProps {
    data: Product[];
}

const ResultsTable = ({ data }: ResultsTableProps) => {
    const [searchTerm, _setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Product | null;
        direction: "ascending" | "descending";
    }>({
        key: null,
        direction: "ascending",
    });

    const handleSort = (key: keyof Product | null) => {
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig.key) return 0;

        const aValue = a[sortConfig.key] as string;
        const bValue = b[sortConfig.key] as string;

        if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
    });

    const filteredData = sortedData.filter((item) =>
        Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <div className="relative">
                    {/* <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" /> */}
                    {/* <Input
                        placeholder="Search products..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    /> */}
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-gray-50">
                        <TableRow>
                            <TableHead onClick={() => handleSort("title")} className="cursor-pointer">
                                <div className="flex items-center">
                                    Title
                                    {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort("productId")} className="cursor-pointer">
                                <div className="flex items-center">
                                    Product ID
                                    {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                                </div>
                            </TableHead>
                            <TableHead onClick={() => handleSort("sku")} className="cursor-pointer">
                                <div className="flex items-center">
                                    SKU
                                    {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((product) => (
                                <TableRow key={product.productId}>
                                    <TableCell className="font-medium">{product.title}</TableCell>
                                    <TableCell><a href={`https://ksp.co.il/web/item/${product.productId}`}>{product.productId}</a></TableCell>
                                    <TableCell>{product.sku}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                                    No results found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="p-3 border-t flex justify-between items-center text-sm text-gray-500">
                <span>{filteredData.length} products found</span>
                {/* <Button variant="outline" size="sm">Export CSV</Button> */}
            </div>
        </div>
    )
}

export default ResultsTable;